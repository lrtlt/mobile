# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# react-native-config looks up BuildConfig by name and reads its fields via reflection
-keep class lt.mediapark.lrt.BuildConfig { *; }

# Room creates databases (e.g. WorkManager's WorkDatabase_Impl) by reflection; R8 full mode strips their constructors
-keep class * extends androidx.room.RoomDatabase { <init>(); }

# @d11/react-native-fast-image (README "ProGuard Config"). Glide instantiates the modules named in the
# manifest by reflection, so their constructors are kept too (R8 full mode strips them otherwise)
-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}
-keep public class * implements com.bumptech.glide.module.GlideModule { <init>(); }
-keep public class * extends com.bumptech.glide.module.AppGlideModule { <init>(...); }
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

# Readable Crashlytics stack traces (the mapping file is uploaded by the Crashlytics plugin)
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
