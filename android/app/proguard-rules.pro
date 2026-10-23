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

# Readable Crashlytics stack traces (the mapping file is uploaded by the Crashlytics plugin)
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
