# Demo Checklist

## Teacher Workflow

1. Open teacher view:

```text
http://localhost:4173/?role=teacher
```

2. Start on the dashboard.
3. Click Hot List Students.
4. Open a student profile.
5. Show student information, hotlist status, notes, and assigned resources.
6. Go to Lesson Resources.
7. Open a resource.
8. Show Resource Details and the Resource Viewer.
9. Share or unshare a resource.
10. Use Restart Demo only if you want to reset the local sample state.

## Student Workflow

1. Open student view:

```text
http://localhost:4173/?role=student
```

2. Click My Resources.
3. Confirm assigned and shared resources appear.
4. Click Open Resource.
5. Confirm the student resource viewer opens.
6. Return to the lesson.
7. Open the Class DQB if needed.

## Resource Upload/Open/Share Test

Teacher resource checks:

- Add Resource button opens the add-resource modal.
- Modal includes title, type, audience, language, file/link field, local file input, shareability, subject, grade, tags, notes, and text content.
- Save creates a resource when form data is entered.
- Resource rows are clickable.
- Open opens Resource Details.
- PDF resources render in an iframe.
- Image resources render an image preview.
- YouTube resources embed a video iframe.
- Website and Google resources provide open buttons.
- Share changes a private resource into shared.
- Make Private removes shared visibility.

Student resource checks:

- Students see assigned resources.
- Students see shared resources.
- Students do not see private unassigned resources.
- Open Resource opens the student viewer.

## Hotlist Test

1. In teacher view, click Hot List Students.
2. Confirm the Hot List panel opens.
3. Confirm Avery J. and Lena S. appear.
4. Click Open Profile for a hotlist student.
5. Confirm the Student Profile page opens.
6. Confirm hotlist status, priority, reason, and target level are visible.

## Demo Script: 3-5 Minutes

### 0:00-0:30: Problem

"This app helps teachers manage AI-supported classroom inquiry without losing control of instruction. It keeps support focused on students, resources, hotlists, and teacher decision-making."

### 0:30-1:15: Teacher Dashboard

Show the dashboard. Click Hot List Students. Explain that the teacher can quickly see students who need targeted support and open a full profile.

### 1:15-2:00: Student Profile

Open Avery J. Show the profile, hotlist status, notes timeline, assigned resources, and quick actions. Emphasize that the student record is becoming the center of support.

### 2:00-3:00: Resources

Open Lesson Resources. Show the library, Resource Details, and Resource Viewer. Explain that resources can be uploaded, linked, shared, assigned, and opened by students.

### 3:00-4:00: Student View

Switch to student view. Open My Resources. Show that students only see assigned or shared resources, then open one.

### 4:00-5:00: Backend Readiness

Explain that the demo is localStorage today, but the backend structure is ready: Supabase migrations exist, provider scaffolds exist, and Google Drive metadata fields are already in the resource model.

## Pre-Demo Reset

Use Restart Demo before presenting if the local data has been changed during testing.

Restart Demo clears local temporary students, uploaded resources, edits, notes, hotlist changes, and assignments, then reloads sample data.
