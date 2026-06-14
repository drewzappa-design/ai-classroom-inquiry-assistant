# Google Drive Integration Plan

## Current Architecture

The app now uses a provider-based resource architecture in `resource-providers.js`.

The active provider is still `LocalResourceProvider`, so the current demo workflow continues to work:

- list resources from local app state
- upload local files as browser data URLs
- open URLs, uploaded files, and generated data URLs
- delete resources from the local demo library
- update shareability metadata

The UI in `app.js` still calls the same resource actions through `ResourceStorage`, but those actions now delegate to a provider. This keeps the current resource pages and viewer unchanged while making Google Drive possible later.

## Backend-Ready Resource Metadata

Every resource is normalized in `app.js` with fields that can map cleanly to a future database and Google Drive file record:

- `id`
- `title`
- `type`
- `source`: `local` or `google_drive`
- `driveFileId`
- `webViewLink`
- `downloadUrl`
- `visibility`: `private`, `class`, `school`, `district`, or `public`
- `assignedStudentIds`
- `assignedClassIds`
- `createdBy`
- `createdAt`

Backward-compatible fields such as `url`, `shareability`, `dateAdded`, `audience`, `category`, `subject`, `gradeLevel`, `tags`, `description`, and `licenseStatus` are still preserved so the current UI does not need to change yet.

## Provider Interface

Each resource provider should implement:

- `list()`
- `listResources()`
- `upload({ file, metadata })`
- `uploadResource({ file, metadata })`
- `open(resourceId)`
- `openResource(resourceId)`
- `delete(resourceId)`
- `deleteResource(resourceId)`
- `share(resourceId, shareability)`
- `shareResource(resourceId, shareability)`

The shorter method names are the preferred interface for new code. The longer `*Resource` names remain as compatibility aliases.

## Future Google Drive Provider

`GoogleDriveProvider` is scaffolded but intentionally not connected yet. It includes comments showing where these pieces will go:

- Google authentication through `authenticate()`
- Google Drive Picker through `pickFile()`
- Drive file upload through `uploadFile()`
- Drive file listing through `listFiles()`
- Drive file opening through `openFile()`
- Drive file permission/sharing through `shareFile()`
- Drive file deletion/unlinking through `deleteFile()`
- Google OAuth sign-in and consent
- Google Drive Picker for selecting existing Drive files
- Drive API upload through `files.create`
- Drive API file listing through `files.list`
- Drive API permission updates through `permissions.create` or `permissions.update`
- shared folder or shared drive access for school/district resource libraries

## School Google Workspace Connection Path

A school Google Workspace account could connect to the app through this flow:

1. A school or district administrator creates a Google Cloud project.
2. The app is registered as an OAuth client.
3. OAuth scopes are approved for Drive file access, preferably limited to app-created files or a specific shared folder when possible.
4. The school creates a shared Drive folder or Shared Drive for classroom resources.
5. Teachers connect their Google Workspace accounts from the app.
6. The app uses Drive Picker to let teachers select Docs, Slides, PDFs, images, and other lesson resources.
7. The app stores Drive file metadata in its database:
   - Drive file id
   - title
   - MIME type
   - web view link
   - thumbnail link when available
   - owner
   - shareability level
   - connected lesson
   - assigned students
8. Student access is handled through Workspace permissions, classroom groups, or app-mediated links depending on district policy.

## Recommended Permission Model

For a school deployment, prefer the narrowest workable Google scopes:

- Use Drive Picker for user-selected files.
- Store file ids and metadata in the app backend.
- Use school-managed groups for student access when possible.
- Avoid public links by default.
- Treat copyright-restricted resources as teacher-only unless the district explicitly permits sharing.

## Backend Requirements For Full Integration

The production version should add:

- authentication and role management
- encrypted OAuth token storage
- database tables for resources, assignments, file permissions, and audit events
- server-side Drive API calls
- district/school configuration for shared folders
- audit logging for sharing, deletion, and student access

## Remaining Work

The scaffold is ready for implementation, but the real Google Drive integration still needs OAuth, backend persistence, and district permission decisions before it should handle live school files.
