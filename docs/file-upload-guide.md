# File Upload Documentation 📤

## Overview
The file upload functionality is implemented in `/app/(chat)/api/files/upload/route.ts` and provides a secure way to handle file uploads with authentication, validation, and storage using Vercel Blob.

## Authentication
The endpoint requires user authentication using NextAuth.js:
- Validates user session before processing any upload
- Returns 401 Unauthorized if no valid session is found

## File Validation
Implements strict file validation using Zod schema:

### Size Restrictions
- Maximum file size: 5MB
- Validation message: "File size should be less than 5MB"

### Supported File Types
- JPEG images (`image/jpeg`)
- PNG images (`image/png`)
- PDF documents (`application/pdf`)
- Validation message: "File type should be JPEG, PNG, or PDF"

## Request Processing

### Request Format
- Method: POST
- Content-Type: multipart/form-data
- Required field: `file` (File object)

### Process Flow
1. Validates user session
2. Checks for empty request body
3. Extracts file from FormData
4. Validates file against FileSchema
5. Converts file to ArrayBuffer
6. Uploads to Vercel Blob storage

## Error Handling

The endpoint handles various error scenarios:

### HTTP Status Codes
- 401: Unauthorized (no valid session)
- 400: Bad Request (empty body, no file, validation errors)
- 500: Internal Server Error (upload/processing failures)

### Error Response Format
```json
{
  "error": "[Error Message]"
}
```

## Storage Integration

Uses Vercel Blob for file storage:
- Files are stored with public access
- Original filename is preserved
- Returns URL and metadata after successful upload

## Successful Response

On successful upload, returns JSON with file details:
```json
{
  "url": "[File URL]",
  "pathname": "[File Path]",
  "contentType": "[MIME Type]"
}
```

## Implementation Example

```typescript
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`/api/files/upload`, {
    method: "POST",
    body: formData
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
  throw new Error("Upload failed");
};
```

## Environment Setup

Required environment variables:
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob storage access token

## Security Considerations

1. Authentication required for all uploads
2. File size limits prevent abuse
3. File type restrictions reduce security risks
4. Public access only for uploaded files

## Best Practices

1. Always validate file types before upload
2. Implement proper error handling
3. Use secure storage configurations
4. Monitor upload sizes and frequencies
5. Maintain audit logs of uploads

## Related Components

- `MultimodalInput`: Handles file selection and upload UI
- `PreviewAttachment`: Displays uploaded file previews

## Troubleshooting

Common issues and solutions:

1. Upload fails with 401
   - Check user authentication
   - Verify session validity

2. File validation errors
   - Ensure file size < 5MB
   - Verify supported file type

3. Storage errors
   - Verify BLOB_READ_WRITE_TOKEN
   - Check Vercel Blob service status