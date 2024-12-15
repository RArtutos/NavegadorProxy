# Account Browser

A specialized browser for managing multiple accounts with automatic cookie handling.

## Features

- Account-based browsing
- Automatic cookie management
- DRM content support
- Minimal interface
- Cross-platform support (Windows & macOS)

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Run the application:
```bash
npm start
```

## Building

### Windows
```bash
npm run build:win
```

### macOS
```bash
npm run build:mac
```

### Both Platforms
```bash
npm run build
```

## DRM Support

To enable DRM content:

1. Download the Widevine CDM for your platform
2. Place it in the `widevine` folder in the project root
3. The application will automatically load the DRM module

## Security

- All communication with the server is encrypted
- Cookies are managed securely
- Authentication is required for all operations

## Notes

- Make sure the server is running before starting the browser
- Update the API_URL in main.js to point to your server
- The browser requires an active internet connection