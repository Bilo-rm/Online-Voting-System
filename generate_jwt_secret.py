#!/usr/bin/env python3
"""
Generate a secure JWT secret for your application.
Run this script and copy the output to your .env file or Render environment variables.
"""

import secrets

if __name__ == "__main__":
    jwt_secret = secrets.token_urlsafe(32)
    print("\n" + "="*60)
    print("🔐 Generated JWT Secret")
    print("="*60)
    print(f"\n{jwt_secret}\n")
    print("="*60)
    print("\nCopy this secret to:")
    print("  • Local: backend/.env as JWT_SECRET=...")
    print("  • Render: Environment Variables as JWT_SECRET")
    print("="*60 + "\n")

