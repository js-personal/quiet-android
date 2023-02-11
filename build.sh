#!/bin/bash
echo "[Build.SH] Deleting last files ..."
# Supprimer le fichier quiet.android.bundle

files=(android/app/.gradle, android/app/build, android/app/src/main/assets/index.android.bundle)

for file in ${files[@]}
do
    rm -r -f $file 2>/dev/null
    echo "> File deleted : $file"
done
# Supprimer les dossiers qui commencent par drawable- dans le chemin android/app/src/main/res
# Supprimer les dossiers qui commencent par drawable- dans le chemin android/app/src/main/res
for dir in android/app/src/main/res/drawable-*
do
    rm -r $dir 2>/dev/null
    echo "> File deleted : $dir"
done

echo "[Build.SH] Files sucessfully deleted !"