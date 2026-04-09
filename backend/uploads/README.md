# Uploads Directory

This directory stores user-uploaded files for the FixBhai application.

## Structure

```
uploads/
└── avatars/          # User profile pictures
    ├── .htaccess     # Apache configuration for image access
    └── avatar_*.jpg  # Uploaded avatar files (gitignored)
```

## Avatar Files

- Format: `avatar_{user_id}_{timestamp}.{ext}`
- Allowed types: JPG, JPEG, PNG, GIF
- Max size: 5MB
- Access: Public (via HTTP)

## Security

- File type validation on upload
- Size limit enforcement
- Unique filenames prevent overwrites
- Old avatars automatically deleted on new upload
- Directory listing disabled via .htaccess

## Permissions

Ensure the web server has write permissions:
```bash
chmod 755 backend/uploads/avatars
```

## Backup

Avatar files are not version controlled (see .gitignore).
Include this directory in your backup strategy.
