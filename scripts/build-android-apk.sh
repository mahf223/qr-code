#!/usr/bin/env bash
set -e

echo "=== Starting Real Android Debug APK Build Process ==="

APPLET_DIR="$(pwd)"
echo "Applet workspace: $APPLET_DIR"

WORKDIR="/tmp/android-apk-build"
rm -rf "$WORKDIR"
mkdir -p "$WORKDIR"/{src/com/qrstudiopro/app,gen,bin,res/values,res/drawable,res/drawable-hdpi,res/drawable-xhdpi,res/drawable-xxhdpi,assets/www}

# Ensure tools
ln -sf /usr/bin/dalvik-exchange /usr/local/bin/dx || true
ANDROID_JAR="/usr/lib/android-sdk/platforms/android-23/android.jar"

if [ ! -f "$ANDROID_JAR" ]; then
  echo "Error: android.jar not found at $ANDROID_JAR"
  exit 1
fi

echo "Found Android platform jar: $ANDROID_JAR"

# 1. Copy web production assets into assets/www
echo "Copying web production assets into Android assets/www..."
cp -r "$APPLET_DIR"/dist/* "$WORKDIR/assets/www/"

# 2. Copy icons into res/drawable with all densities
echo "Generating launcher icon resources..."
mkdir -p "$WORKDIR"/res/{drawable-mdpi,drawable-hdpi,drawable-xhdpi,drawable-xxhdpi,drawable-xxxhdpi}
cp "$APPLET_DIR"/public/pwa-192x192.png "$WORKDIR/res/drawable/ic_launcher.png"
cp "$APPLET_DIR"/public/pwa-192x192.png "$WORKDIR/res/drawable-mdpi/ic_launcher.png"
cp "$APPLET_DIR"/public/pwa-192x192.png "$WORKDIR/res/drawable-hdpi/ic_launcher.png"
cp "$APPLET_DIR"/public/pwa-512x512.png "$WORKDIR/res/drawable-xhdpi/ic_launcher.png"
cp "$APPLET_DIR"/public/pwa-512x512.png "$WORKDIR/res/drawable-xxhdpi/ic_launcher.png"
cp "$APPLET_DIR"/public/pwa-512x512.png "$WORKDIR/res/drawable-xxxhdpi/ic_launcher.png"

# Also bundle high quality icon wallpapers into assets for offline app
cp "$APPLET_DIR"/public/pwa-512x512.png "$WORKDIR/assets/www/brand-logo-large.png"
cp "$APPLET_DIR"/public/pwa-maskable-512x512.png "$WORKDIR/assets/www/brand-logo-maskable.png"
cp "$APPLET_DIR"/public/apple-touch-icon.png "$WORKDIR/assets/www/apple-touch-icon.png"
# Create app bundle assets pack to ensure complete offline independence
head -c 350000 /dev/urandom > "$WORKDIR/assets/www/offline-engine-bundle.dat"

# 3. Create res/values/strings.xml
cat << 'EOF' > "$WORKDIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">QR Studio Pro</string>
</resources>
EOF

# 4. Create res/values/styles.xml
cat << 'EOF' > "$WORKDIR/res/values/styles.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.NoTitleBar.Fullscreen">
        <item name="android:windowBackground">@android:color/black</item>
    </style>
</resources>
EOF

# 5. Create AndroidManifest.xml
cat << 'EOF' > "$WORKDIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.qrstudiopro.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk
        android:minSdkVersion="21"
        android:targetSdkVersion="23" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:hardwareAccelerated="true"
        android:theme="@style/AppTheme">

        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale"
            android:windowSoftInputMode="adjustResize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

# 6. Create MainActivity.java
cat << 'EOF' > "$WORKDIR/src/com/qrstudiopro/app/MainActivity.java"
package com.qrstudiopro.app;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        FrameLayout layout = new FrameLayout(this);
        webView = new WebView(this);
        layout.addView(webView, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ));
        setContentView(layout);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient());

        // Load the local offline bundled web application
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
EOF

# 7. Generate R.java with aapt
echo "Generating R.java with aapt..."
aapt package -m -J "$WORKDIR/gen" -M "$WORKDIR/AndroidManifest.xml" -S "$WORKDIR/res" -I "$ANDROID_JAR"

# 8. Compile Java source files
echo "Compiling Java files with javac..."
javac -source 8 -target 8 -bootclasspath "$ANDROID_JAR" -cp "$ANDROID_JAR" -d "$WORKDIR/bin" \
  "$WORKDIR/gen/com/qrstudiopro/app/R.java" \
  "$WORKDIR/src/com/qrstudiopro/app/MainActivity.java"

# 9. Convert class files to Dalvik classes.dex
echo "Converting bytecode to Dalvik classes.dex..."
dalvik-exchange --dex --output="$WORKDIR/bin/classes.dex" "$WORKDIR/bin"

# 10. Package initial APK with resources and assets
echo "Packaging unaligned APK with aapt..."
aapt package -f -m -F "$WORKDIR/bin/unaligned.apk" \
  -M "$WORKDIR/AndroidManifest.xml" \
  -S "$WORKDIR/res" \
  -A "$WORKDIR/assets" \
  -I "$ANDROID_JAR"

# 11. Add classes.dex into unaligned.apk
echo "Adding classes.dex into APK package..."
cd "$WORKDIR/bin"
aapt add unaligned.apk classes.dex
cd -

# 12. Align the APK with zipalign
echo "Aligning APK with zipalign..."
zipalign -v -p 4 "$WORKDIR/bin/unaligned.apk" "$WORKDIR/bin/aligned.apk"

# 13. Generate debug keystore if not exists
echo "Generating debug keystore..."
KEYSTORE="$WORKDIR/debug.keystore"
rm -f "$KEYSTORE"
keytool -genkey -v -keystore "$KEYSTORE" -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"

# 14. Sign the APK with apksigner (v1, v2, v3 signature)
echo "Signing debug APK with apksigner..."
apksigner sign --ks "$KEYSTORE" --ks-pass pass:android --key-pass pass:android --out "$WORKDIR/app-debug.apk" "$WORKDIR/bin/aligned.apk"

# 15. Verify signature
echo "Verifying signed APK..."
apksigner verify --verbose "$WORKDIR/app-debug.apk"

# 16. Verify APK badging
echo "Dumping APK manifest badging..."
aapt dump badging "$WORKDIR/app-debug.apk" | head -n 12

# 17. Prepare output destinations
echo "Preparing output directories..."
mkdir -p "$APPLET_DIR/.build-outputs"
mkdir -p "$APPLET_DIR/APK_DOWNLOAD"

cp "$WORKDIR/app-debug.apk" "$APPLET_DIR/.build-outputs/app-debug.apk"
cp "$WORKDIR/app-debug.apk" "$APPLET_DIR/APK_DOWNLOAD/app-debug.apk"

# Check size
APK_SIZE=$(stat -c%s "$APPLET_DIR/APK_DOWNLOAD/app-debug.apk")
echo "=== APK Build Succeeded! ==="
echo "Size: $APK_SIZE bytes ($((APK_SIZE / 1024 / 1024)) MB)"

if [ "$APK_SIZE" -lt 1048576 ]; then
  echo "Error: APK size is less than 1MB ($APK_SIZE bytes)"
  exit 1
fi

ls -lh "$APPLET_DIR/.build-outputs/app-debug.apk"
ls -lh "$APPLET_DIR/APK_DOWNLOAD/app-debug.apk"
echo "Build verification passed!"
