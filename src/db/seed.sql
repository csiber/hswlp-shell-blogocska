INSERT OR IGNORE INTO user (
  id,
  firstName,
  lastName,
  email,
  passwordHash,
  role,
  createdAt,
  updatedAt
) VALUES (
  'usr_adminseed',
  'Admin',
  'User',
  'admin@example.com',
  '31be8c7850f92e1dadb5e5f6e420d08a:1c97d36fcfe33d6b70db85717346917be26317634c3e557b8517054c84467ad8',
  'admin',
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT OR IGNORE INTO post_category (
  id,
  slug,
  name
) VALUES (
  'pcat_general',
  'general',
  'General'
);

INSERT OR IGNORE INTO posts (
  id,
  user_id,
  title,
  content,
  category,
  status,
  created_at,
  updated_at
) VALUES (
  'pst_welcome',
  'usr_adminseed',
  'Welcome to Blogocska',
  'This is your first post!',
  'general',
  'approved',
  strftime('%s','now'),
  strftime('%s','now')
);
