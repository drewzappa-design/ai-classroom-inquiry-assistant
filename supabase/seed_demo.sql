-- classroom-ai-assistant
-- Demo seed data matching the current localStorage app.
--
-- Important:
-- profiles.id references auth.users(id). These IDs have been updated to match
-- the real classroom-ai-assistant Supabase Auth users supplied for this demo:
-- admin: a066ff9e-3c02-42a0-8f61-46fb91f2091a
-- teacher: 2c3693b5-ab1f-4242-b8ea-0df64ec637f3

insert into public.profiles (id, email, full_name, role, school_id, district_id)
values
  ('2c3693b5-ab1f-4242-b8ea-0df64ec637f3', 'ms.rivera@example.edu', 'Ms. Rivera', 'teacher', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001'),
  ('a066ff9e-3c02-42a0-8f61-46fb91f2091a', 'admin@example.edu', 'Demo School Admin', 'admin', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001')
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  school_id = excluded.school_id,
  district_id = excluded.district_id;

insert into public.students (
  id, student_number, first_name, last_name, display_name, grade_level, language,
  reading_level, math_level, support_tags, status, notes_summary, school_id, created_by
)
values
  ('00000000-0000-4000-8000-000000000101', 's1', 'Avery', 'J.', 'Avery J.', '7', 'English', 'Grade 7', 'Grade 7', array['Hot List'], 'On level', 'Ready to move up with evidence-based explanations.', '10000000-0000-4000-8000-000000000001', '2c3693b5-ab1f-4242-b8ea-0df64ec637f3'),
  ('00000000-0000-4000-8000-000000000102', 's2', 'Camila', 'R.', 'Camila R.', '7', 'Spanish', 'Grade 7', 'Grade 7', array['English Learner'], 'On level', 'Benefits from bilingual vocabulary checks.', '10000000-0000-4000-8000-000000000001', '2c3693b5-ab1f-4242-b8ea-0df64ec637f3'),
  ('00000000-0000-4000-8000-000000000103', 's3', 'Eli', 'M.', 'Eli M.', '7', 'English', 'Grade 5', 'Grade 6', array['IEP/504','Intervention'], 'Intervention', 'Needs short chunks and concrete examples.', '10000000-0000-4000-8000-000000000001', '2c3693b5-ab1f-4242-b8ea-0df64ec637f3'),
  ('00000000-0000-4000-8000-000000000104', 's4', 'Jordan', 'T.', 'Jordan T.', '7', 'English', 'Grade 9', 'Grade 8', array['Gifted'], 'Above level', 'Use extension prompts and tradeoff reasoning.', '10000000-0000-4000-8000-000000000001', '2c3693b5-ab1f-4242-b8ea-0df64ec637f3'),
  ('00000000-0000-4000-8000-000000000105', 's5', 'Lena', 'S.', 'Lena S.', '7', 'English', 'Grade 6', 'Grade 6', array['Intervention','Hot List'], 'Below level', 'Sentence starters help her connect habitat to population change.', '10000000-0000-4000-8000-000000000001', '2c3693b5-ab1f-4242-b8ea-0df64ec637f3'),
  ('00000000-0000-4000-8000-000000000106', 's6', 'Micah', 'P.', 'Micah P.', '7', 'English', 'Grade 7', 'Grade 7', array[]::text[], 'On level', 'Push toward evidence and systems reasoning.', '10000000-0000-4000-8000-000000000001', '2c3693b5-ab1f-4242-b8ea-0df64ec637f3')
on conflict (id) do update set
  display_name = excluded.display_name,
  support_tags = excluded.support_tags,
  status = excluded.status,
  notes_summary = excluded.notes_summary;

insert into public.classes (id, name, subject, grade_level, period, school_id, teacher_id)
values (
  '00000000-0000-4000-8000-000000000201',
  'Period 2 Science',
  'Science',
  '7',
  'Period 2',
  '10000000-0000-4000-8000-000000000001',
  '2c3693b5-ab1f-4242-b8ea-0df64ec637f3'
)
on conflict (id) do update set
  name = excluded.name,
  subject = excluded.subject,
  grade_level = excluded.grade_level,
  period = excluded.period;

insert into public.class_memberships (class_id, student_id, member_role)
values
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000101', 'student'),
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000102', 'student'),
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000103', 'student'),
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000104', 'student'),
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000105', 'student'),
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000106', 'student')
on conflict do nothing;

insert into public.class_memberships (class_id, profile_id, member_role)
values ('00000000-0000-4000-8000-000000000201', '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', 'teacher')
on conflict do nothing;

insert into public.resources (
  id, title, description, type, source, drive_file_id, web_view_link, download_url,
  text_content, visibility, license_status, subject, grade_level, tags, created_by, school_id
)
values
  ('00000000-0000-4000-8000-000000000301', 'Lesson 6 Slides', 'Slides A-G', 'PPTX', 'local', null, null, null, null, 'private', 'Copyright restricted / do not share', 'Science', '7', array['Slides A-G'], '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', '10000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000302', 'Lesson 6 Teacher Edition', 'Teacher reference', 'DOCX', 'local', null, null, null, null, 'private', 'Private', 'Science', '7', array['Teacher reference'], '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', '10000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000303', 'Student Procedure', 'English', 'DOCX', 'local', null, null, null, null, 'school', 'Share with school', 'Science', '7', array['English'], '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', '10000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000304', 'Palm Farm Designs', 'English', 'DOCX', 'local', null, null, null, null, 'school', 'Share with school', 'Science', '7', array['English'], '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', '10000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000305', 'Procedimiento del estudiante', 'Spanish', 'DOCX', 'local', null, null, null, null, 'school', 'Share with school', 'Science', '7', array['Spanish'], '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', '10000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000306', 'Diseños de finca de palmeras', 'Spanish', 'DOCX', 'local', null, null, null, null, 'school', 'Share with school', 'Science', '7', array['Spanish'], '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', '10000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000307', 'Demo PDF Viewer Sample', 'A small public PDF used to verify the in-app PDF viewer.', 'PDF', 'website', null, 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', null, 'public', 'Public/open resource', 'Science', '7', array['demo','pdf'], '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', '10000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000308', 'Rainforest Food Web Image', 'A simple image preview resource for the viewer.', 'Image', 'local', null, null, 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''900'' height=''520'' viewBox=''0 0 900 520''%3E%3Crect width=''900'' height=''520'' fill=''%23dceef3''/%3E%3Ctext x=''450'' y=''260'' text-anchor=''middle'' font-family=''Arial'' font-size=''32'' fill=''%23184d43''%3ERainforest ecosystem image resource%3C/text%3E%3C/svg%3E', null, 'class', 'Teacher-created', 'Science', '7', array['image','ecosystem'], '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', '10000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000309', 'OpenSciEd Website', 'External website resource that opens safely in a new tab.', 'Website URL', 'website', null, 'https://www.openscied.org/', null, null, 'public', 'Public/open resource', 'Science', '7', array['website','curriculum'], '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', '10000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000310', 'Palm Oil Explainer Video', 'YouTube resource used to verify embedded video playback.', 'YouTube URL', 'youtube', null, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', null, null, 'public', 'Public/open resource', 'Science', '7', array['video','demo'], '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', '10000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000311', 'Google Doc Planning Template', 'Google Docs resources open in a new tab so permissions remain with Google.', 'Google Docs URL', 'google_drive', '1', 'https://docs.google.com/document/d/1', null, null, 'private', 'Private', 'Science', '7', array['google doc','planning'], '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', '10000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000312', 'Plain Text Scaffold', 'A plain text resource rendered directly inside the app.', 'Plain text', 'text', null, null, null, 'Use this scaffold: A successful palm farm design should support farmers by ___ and support orangutans by ___. One constraint is ___. One criterion is ___.', 'class', 'Teacher-created', 'Science', '7', array['text','scaffold'], '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', '10000000-0000-4000-8000-000000000001')
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  visibility = excluded.visibility,
  license_status = excluded.license_status,
  tags = excluded.tags;

insert into public.resource_assignments (resource_id, student_id, assigned_by)
values
  ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000101', '2c3693b5-ab1f-4242-b8ea-0df64ec637f3'),
  ('00000000-0000-4000-8000-000000000303', '00000000-0000-4000-8000-000000000102', '2c3693b5-ab1f-4242-b8ea-0df64ec637f3')
on conflict do nothing;

insert into public.hotlist_items (
  id, student_id, class_id, teacher_id, status, priority, target_level, reason, support_notes, inquiry_credit_percent
)
values
  ('00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000201', '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', 'active', 'Medium', 'Apprentice close to Proficient', 'Ready to move up with evidence-based explanations.', 'Require one clear piece of evidence and one explanation sentence.', 85),
  ('00000000-0000-4000-8000-000000000402', '00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000201', '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', 'active', 'High', 'Novice close to Apprentice', 'Sentence starters help her connect habitat to population change.', 'Use sentence starters and concrete habitat/population evidence.', 100)
on conflict (id) do update set
  status = excluded.status,
  priority = excluded.priority,
  target_level = excluded.target_level,
  reason = excluded.reason,
  support_notes = excluded.support_notes,
  inquiry_credit_percent = excluded.inquiry_credit_percent;

insert into public.student_notes (student_id, class_id, teacher_id, note, intervention_type, visibility)
values
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000201', '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', 'Ready to move up with evidence-based explanations.', 'Hotlist check-in', 'teacher_private'),
  ('00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000201', '2c3693b5-ab1f-4242-b8ea-0df64ec637f3', 'Sentence starters help her connect habitat to population change.', 'Intervention note', 'teacher_private')
on conflict do nothing;
