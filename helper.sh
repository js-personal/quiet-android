#!/bin/bash

#################################
    #NODE_MODULES RESET FILE
#################################
if [ $1 = '--reset-modules' ]; then
    echo "[Helper.SH] Deleting node_modules files ..."
    # Supprimer le fichier quiet.android.bundle

    sed -i -e '/node_modules/d' 2>/dev/null

    echo "[Helper.SH] Files sucessfully deleted !"



#################################
    #ANDROID RESET FILES
#################################
elif [ $1 = '--reset-android' ]; then
    echo "[Helper.SH] Deleting last Android build files ..."
    # Supprimer le fichier quiet.android.bundle

    files=(android/.gradle/ android/app/build/ android/app/src/main/assets/index.android.bundle)

    for file in "${files[@]}"
    do
        if [ -d "$file" ]; then
            echo "> Deleting file $file ..."
            sed -i -e "/$file/d" 2>/dev/null

        elif [ -f "$file" ]; then
            echo "> Deleting directory $file ..."
            sed -i -e "/$file/d" 2>/dev/null
        else
            echo "> File or directory does not exist: $file"
        fi
    done
    # Supprimer les dossiers qui commencent par drawable- dans le chemin android/app/src/main/res
    for dir in android/app/src/main/res/drawable-*
    do
        echo "> Deleting directory $file ..."
        rm -r $dir 2>/dev/null
    done

    echo "[Helper.SH] Files sucessfully deleted !"
fi
