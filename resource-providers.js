(function () {
  class ResourceProvider {
    async list() {
      return this.listResources();
    }

    async listResources() {
      throw new Error("listResources() must be implemented by a resource provider.");
    }

    async upload(input) {
      return this.uploadResource(input);
    }

    async uploadResource() {
      throw new Error("uploadResource() must be implemented by a resource provider.");
    }

    async open(resourceId) {
      return this.openResource(resourceId);
    }

    async openResource() {
      throw new Error("openResource() must be implemented by a resource provider.");
    }

    async delete(resourceId) {
      return this.deleteResource(resourceId);
    }

    async deleteResource() {
      throw new Error("deleteResource() must be implemented by a resource provider.");
    }

    async share(resourceId, shareability) {
      return this.shareResource(resourceId, shareability);
    }

    async shareResource() {
      throw new Error("shareResource() must be implemented by a resource provider.");
    }
  }

  class LocalResourceProvider extends ResourceProvider {
    constructor(options) {
      super();
      this.getState = options.getState;
      this.saveState = options.saveState;
      this.normalizeResource = options.normalizeResource;
      this.fileToDataUrl = options.fileToDataUrl;
      this.today = options.today;
      this.onMissingResource = options.onMissingResource;
    }

    async listResources() {
      return this.getState().resourceList || [];
    }

    async uploadResource({ file, metadata = {} }) {
      // TODO Supabase Storage later: upload file bytes to a protected bucket, then store resource metadata separately.
      if (!file) throw new Error("Choose a file before uploading.");
      if (file.size > 8 * 1024 * 1024) throw new Error("File too large. Use a file under 8MB for this local demo.");
      const state = this.getState();
      const dataUrl = await this.fileToDataUrl(file);
      const extension = file.name.split(".").pop()?.toUpperCase() || "FILE";
      const newResource = this.normalizeResource({
        id: `r-upload-${Date.now()}`,
        title: metadata.title || file.name,
        type: metadata.type || extension,
        category: metadata.type || extension,
        url: dataUrl,
        downloadUrl: dataUrl,
        webViewLink: "",
        driveFileId: "",
        fileName: file.name,
        dateAdded: this.today(),
        createdAt: new Date().toISOString(),
        createdBy: metadata.createdBy || "Ms. Rivera",
        shareability: metadata.shareability || "Private",
        audience: metadata.audience || "Teacher",
        visibility: metadata.visibility || "private",
        assignedStudentIds: metadata.assignedStudentIds || [],
        assignedClassIds: metadata.assignedClassIds || [],
        language: metadata.language || "English",
        description: metadata.description || "Teacher uploaded file.",
        subject: metadata.subject || state.lessonSetup.subject,
        gradeLevel: metadata.gradeLevel || state.lessonSetup.gradeLevel,
        tags: metadata.tags || ["uploaded"],
        textContent: metadata.textContent || "",
        source: "local",
        licenseStatus: metadata.licenseStatus || metadata.shareability || "Private",
      }, 0, state.lessonSetup);
      state.resourceList.unshift(newResource);
      state.resources = state.resourceList;
      this.saveState();
      return newResource;
    }

    async openResource(resourceId) {
      // TODO provider swap: local demo opens data URLs/links now; Google Drive and Supabase Storage will resolve signed/view URLs here.
      const resource = (this.getState().resourceList || []).find((item) => item.id === resourceId);
      const openUrl = resource?.webViewLink || resource?.downloadUrl || resource?.url;
      if (!resource || !openUrl) {
        this.onMissingResource?.(resourceId);
        return false;
      }
      window.open(openUrl, "_blank", "noopener,noreferrer");
      return true;
    }

    async deleteResource(resourceId) {
      const state = this.getState();
      state.resourceList = (state.resourceList || []).filter((resource) => resource.id !== resourceId);
      state.resources = state.resourceList;
      state.students.forEach((student) => {
        student.assignedResources = (student.assignedResources || []).filter((assignment) => assignment.resourceId !== resourceId);
      });
      state.selectedResource = state.resourceList[0]?.id || null;
      this.saveState();
      return true;
    }

    async shareResource(resourceId, shareability) {
      // TODO permissions later: map local visibility to Drive permissions or Supabase RLS-backed access records.
      const resource = (this.getState().resourceList || []).find((item) => item.id === resourceId);
      if (!resource) return null;
      const nextShareability = shareability || (resource.shareability === "Private" ? "Share with school" : "Private");
      resource.shareability = nextShareability;
      resource.visibility = nextShareability === "Private" ? "private" : "school";
      this.saveState();
      return resource;
    }
  }

  const LocalStorageResourceProvider = LocalResourceProvider;

  class SupabaseResourceProvider extends ResourceProvider {
    constructor(options = {}) {
      super();
      this.options = options;
      this.normalizeResource = options.normalizeResource || ((resource) => resource);
      // Dedicated Supabase project for this app: classroom-ai-assistant.
      // Future: set these from environment/config, never hard-code real keys in this file.
      // SUPABASE_URL: paste the classroom-ai-assistant project URL into config when ready.
      // SUPABASE_ANON_KEY: paste the classroom-ai-assistant anon public key into config when ready.
      this.supabaseUrl = options.supabaseUrl || "";
      this.supabaseAnonKey = options.supabaseAnonKey || "";
      this.client = options.client || null;
    }

    isConfigured() {
      return Boolean(
        this.supabaseUrl &&
        this.supabaseAnonKey &&
        !this.supabaseUrl.includes("YOUR-PROJECT-REF") &&
        !this.supabaseUrl.includes("SUPABASE_URL") &&
        !this.supabaseAnonKey.includes("YOUR_SUPABASE_ANON_KEY") &&
        !this.supabaseAnonKey.includes("SUPABASE_ANON_KEY")
      );
    }

    async request(table, query = "select=*") {
      if (!this.isConfigured()) {
        throw new Error("Supabase is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY in app-config.js.");
      }
      const url = `${this.supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}?${query}`;
      const response = await fetch(url, {
        headers: {
          apikey: this.supabaseAnonKey,
          Authorization: `Bearer ${this.supabaseAnonKey}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Supabase read failed for ${table}: ${response.status} ${detail}`);
      }
      return response.json();
    }

    async authenticate() {
      // Future: initialize Supabase client and call supabase.auth methods for teacher/student/admin sessions.
      // Future: support school SSO or magic-link login once auth policy is chosen.
      return { mode: "anon-read-only", configured: this.isConfigured() };
    }

    async listResources() {
      const rows = await this.request("resources", "select=*&deleted_at=is.null&order=created_at.desc");
      return rows.map((row, index) => this.normalizeResource({
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        category: row.type,
        source: row.source,
        driveFileId: row.drive_file_id || "",
        webViewLink: row.web_view_link || "",
        downloadUrl: row.download_url || "",
        url: row.web_view_link || row.download_url || "",
        textContent: row.text_content || "",
        visibility: row.visibility,
        shareability: this.shareabilityFromVisibility(row.visibility),
        licenseStatus: row.license_status || "",
        subject: row.subject || "",
        gradeLevel: row.grade_level || "",
        tags: row.tags || [],
        createdBy: row.created_by || "",
        createdAt: row.created_at || "",
        dateAdded: row.created_at ? row.created_at.slice(0, 10) : "",
        assignedStudentIds: [],
        assignedClassIds: [],
      }, index));
    }

    async createResource() {
      // Future: insert into resources, then optionally create resource_assignments rows.
      throw new Error("Supabase createResource is disabled during read-only integration.");
    }

    async updateResource() {
      // Future: update resources metadata such as title, type, visibility, links, tags, and Drive file ids.
      throw new Error("Supabase updateResource is disabled during read-only integration.");
    }

    async deleteResource(resourceId) {
      // Future: delete or soft-delete resources owned by the teacher, with cascading assignment cleanup by policy.
      throw new Error(`Supabase deleteResource is disabled during read-only integration for ${resourceId}.`);
    }

    async assignResource() {
      // Future: insert resource_assignments rows for one student, many students, classes, or groups.
      throw new Error("Supabase assignResource is disabled during read-only integration.");
    }

    async unassignResource() {
      // Future: delete resource_assignments rows while preserving audit/history if required by school policy.
      throw new Error("Supabase unassignResource is disabled during read-only integration.");
    }

    async listStudentResources() {
      // Future: query assigned resources plus class/school/shared resources visible to the active student.
      return [];
    }

    async listClasses() {
      const rows = await this.request("classes", "select=*&order=created_at.asc");
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        subject: row.subject || "",
        gradeLevel: row.grade_level || "",
        period: row.period || "",
        schoolId: row.school_id || "",
        teacherId: row.teacher_id || "",
        createdAt: row.created_at || "",
      }));
    }

    async listStudents() {
      const rows = await this.request("students", "select=*&order=display_name.asc");
      return rows.map((row) => ({
        id: row.id,
        studentId: row.student_number || row.id,
        name: row.display_name,
        initials: this.initials(row.display_name),
        grade: row.grade_level || "",
        className: "Supabase class",
        language: row.language || "English",
        level: row.status || "On level",
        proficiency: this.proficiencyFromStatus(row.status),
        support: row.support_tags || [],
        hotListMove: "",
        allocation: row.support_tags?.includes("Hot List") ? 85 : 60,
        monthlyCredits: row.support_tags?.includes("Intervention") ? 150 : 100,
        used: 0,
        progress: row.support_tags?.includes("Intervention") ? 43 : 67,
        reading: row.reading_level || "",
        math: row.math_level || "",
        notes: row.notes_summary || "",
        dateAdded: row.created_at ? row.created_at.slice(0, 10) : "",
        profileNotes: row.notes_summary ? [{
          id: `note-${row.id}`,
          date: row.created_at ? row.created_at.slice(0, 10) : "",
          teacher: "Supabase teacher",
          type: row.support_tags?.includes("Hot List") ? "Hotlist check-in" : "General note",
          note: row.notes_summary,
        }] : [],
        assignedResources: [],
        hotlistInfo: {
          priority: row.support_tags?.includes("Hot List") ? "Medium" : "Not set",
          dateAdded: row.created_at ? row.created_at.slice(0, 10) : "",
          reason: row.notes_summary || "",
        },
        aiHistory: [],
      }));
    }

    async listHotlistItems() {
      return this.request("hotlist_items", "select=*&status=eq.active&order=created_at.desc");
    }

    shareabilityFromVisibility(visibility = "") {
      if (visibility === "school") return "Share with school";
      if (visibility === "district") return "Share with district";
      if (visibility === "public") return "Public/open resource";
      if (visibility === "class") return "Teacher-created";
      return "Private";
    }

    initials(name = "") {
      return String(name)
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "ST";
    }

    proficiencyFromStatus(status = "") {
      const value = String(status).toLowerCase();
      if (value.includes("below") || value.includes("intervention")) return "Novice";
      if (value.includes("above")) return "Distinguished";
      return "Apprentice";
    }
  }

  class GoogleDriveProvider extends ResourceProvider {
    constructor(options = {}) {
      super();
      this.options = options;
    }

    async authenticate() {
      // Future: initialize Google Identity Services and request Drive scopes after admin/client configuration exists.
      throw new Error("Google Drive authentication is not connected yet.");
    }

    async pickFile() {
      // TODO Google Picker: open Google Drive Picker so teachers can choose existing Docs, Slides, PDFs, images, or folders.
      throw new Error("Google Drive Picker is not connected yet.");
    }

    async listFiles() {
      // Future: call Drive API files.list for app-created files, selected folders, or district Shared Drives.
      return this.listResources();
    }

    async listResources() {
      // TODO OAuth login: initialize Google Identity Services, then use Drive API files.list scoped to the school resource folder.
      // Future: include files from a district shared drive or shared folder when an administrator grants access.
      return [];
    }

    async uploadFile() {
      // Future: call Drive API files.create with metadata, media upload, and app/database resource metadata.
      return this.uploadResource();
    }

    async upload() {
      // Future: mirror ResourceProvider.upload() once Google OAuth and Drive API calls are enabled.
      return this.uploadResource();
    }

    async uploadResource() {
      // TODO OAuth login: use Google OAuth access token and Drive API files.create for uploads.
      // TODO Google Picker: use Google Drive Picker for selecting an existing Doc, Slide, Sheet, PDF, image, or folder item.
      // Future: store returned driveFileId, webViewLink, downloadUrl, MIME type, owners, and permission metadata.
      throw new Error("Google Drive upload is not connected yet.");
    }

    async openFile(resourceId) {
      // Future: resolve resourceId to Drive metadata and open webViewLink or downloadUrl.
      return this.openResource(resourceId);
    }

    async open(resourceId) {
      // Future: mirror ResourceProvider.open() against Drive file metadata.
      return this.openResource(resourceId);
    }

    async openResource(resourceId) {
      // Future: resolve resourceId to Drive file metadata and open webViewLink or export link.
      // Future: for Google Docs/Slides/Sheets, rely on Workspace permissions and open in a new tab.
      // TODO student view-only access: students should receive view-only Drive links or app-mediated signed URLs.
      throw new Error(`Google Drive open is not connected yet for ${resourceId}.`);
    }

    async deleteFile(resourceId) {
      // Future: delete or unlink the Drive file based on ownership, admin policy, and teacher confirmation.
      return this.deleteResource(resourceId);
    }

    async delete(resourceId) {
      // Future: mirror ResourceProvider.delete() against Drive file metadata and school policy.
      return this.deleteResource(resourceId);
    }

    async deleteResource(resourceId) {
      // Future: use Drive API files.delete or remove the app metadata record only, depending on school policy.
      // Future: avoid deleting district-owned shared files unless the user owns the file and confirms.
      throw new Error(`Google Drive delete is not connected yet for ${resourceId}.`);
    }

    async shareFile(resourceId) {
      // Future: map app visibility to Drive permissions or Workspace groups.
      return this.shareResource(resourceId);
    }

    async share(resourceId) {
      // Future: mirror ResourceProvider.share() against Drive permissions.
      return this.shareResource(resourceId);
    }

    async shareResource(resourceId) {
      // Future: use Drive API permissions.create/update for teacher, school, district, or public sharing.
      // TODO Drive file permissions: map app shareability labels to Workspace groups, shared drives, and domain-restricted links.
      // TODO domain-restricted sharing: support school-domain only links and district Shared Drive policies.
      throw new Error(`Google Drive sharing is not connected yet for ${resourceId}.`);
    }
  }

  function createResourceProvider(kind, options) {
    if (kind === "supabase") return new SupabaseResourceProvider(options);
    if (kind === "googleDrive") return new GoogleDriveProvider(options);
    return new LocalResourceProvider(options);
  }

  window.ResourceProviders = {
    ResourceProvider,
    LocalResourceProvider,
    LocalStorageResourceProvider,
    GoogleDriveProvider,
    SupabaseResourceProvider,
    createResourceProvider,
  };
})();
