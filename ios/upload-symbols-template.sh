#!/bin/sh

#  upload-symbols.sh
#  Created by Greg Whatley on 1/11/19.
#
#  TEMPLATE ONLY
#  COMPLETE LINES 15 AND 16 BEFORE USING
#
#  This script uploads dSYMs to Firebase for processing.
#  Usage: Find the archive to upload dSYMs from and click "Download Debug Symbols" from Xcode Organizer.  Drag script into terminal then drag archive file (~/Library/Developer/Xcode/Archives) into terminal after script.  Press return.

# Note: If you haven't migrated from Fabric Crashlytics, replace FirebaseCrashlytics to Fabric on line 15.

ARCHIVE=$1
UPLOADSCRIPT="./Pods/FirebaseCrashlytics/upload-symbols" # Path to Fabric upload script
GOOGLECONFIG="./GoogleService-Info.plist"   # Path to Google services info

if [ -d $ARCHIVE ]; then
    find "$ARCHIVE/dSYMs" -name "*.dSYM" | xargs -I \{\} $UPLOADSCRIPT -gsp $GOOGLECONFIG -p ios \{\}
    echo "Upload complete!"
else
    echo "Archive does not exist!"
fi
