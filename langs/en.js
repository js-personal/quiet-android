export default {
    api: {
        app_cant_launch:
            "L'application ne peut pas démarrer sur votre périphérique.",
    },
    auth: {
        title: {
            opt_for_stealth: 'Opt for stealth',
            register: 'Inscription',
            register_email: 'Ajoutez votre E-mail',
            confirm_register: 'Confirmez votre compte',
            retrieve_password: 'Récupérer mot de passe',
        },
        code: {
            number: 'Un code de vérification à 6 chiffres a été envoyé par SMS au',
            email: 'Un code de vérification à 6 chiffres a été envoyé par email à',
            enter: 'Entrer le code',
            not_received: 'Code non reçu',
            not_correspond: 'Les codes entrés ne correspondent pas. Réessayez.',
            create_ogs: 'Créez code OGS',
            create_ogs_sub:
                "Ce code est irrécupérable. Il sert a chiffrer toutes vos données de session. Si vous le perdez, un nouveau code sera créer et l'ancienne session définitivement supprimée",
            enter_ogs: 'Entrez code OGS',
            enter_ogs_sub: 'Entrez votre OGS pour déchiffrer votre session.',
            confirm_ogs: 'Confirmez code OGS',
            confirm_ogs_sub: 'Confirmez votre code pour créer votre session.',
        },
        password: {
            lost: 'Mot de passe perdu ?',
        },
    },
    app: {
        flux: {
            title: 'Ajout de flux',
            empty: "Vous n'avez rejoins aucun flux pour le moment. Appuyez sur le + pour en rejoindre ou créer le votre.",
            join: 'Rejoindre un flux',
            join_code: 'Rejoindre avec un code',
            join_qr: 'Scanner un QR-Code',
            create: 'Créer un flux',
            create_bi: 'Créer un flux bi-directionnel chiffré',
            create_multi: 'Créer un flux multi-directionnel non-chiffré',
            no_conected: 'Non connecté',
            no_conected_sub: 'Appuyez pour afficher les méthodes de connexions',
            share_code: 'Partagez ce code à votre contact',
            share_qr: 'Faites scanner ce QR Code par votre contact',
            invite: ' Hey ! Voici un code pour rejoindre mon flux Quiet : ',
            type_code: 'Tapez le code du flux',
            no_message: 'Aucun message',
            qr_not_reconize:
                "Le QRcode scanné n'est pas reconnu comme une clef d'invitation. Retentez.",
            joined: 'Vous avez rejoins un nouveau flux !',
            not_joined: 'Impossible de rejoindre ce flux.',
            too_much_3: 'Vous avez déjà 3 flux de libre.',
            create: 'Création de flux',
            create_impossible: 'Impossible de créer le flux',
            someone_join:
                "Une personne a rejoint l'un de vos flux bi-directionnel.",
            proprietary: 'Propriétaire',
            invited: 'Invité',
            creation: 'Créer',
            invitation: 'Rejoindre',
            enc_message: 'Message chiffré',
            more_events: 'Voir plus',
            eject: 'Ejection',
            eject_owner:
                'Êtes-vous sur de vouloir quitter ce flux ? Votre contact sera perdu et votre flux sera réinitialisé.',
            eject_client:
                'Êtes-vous sur de vouloir quitter ce flux ? Vous perdrez votre contact.',

            handler: {
                create_bi: {
                    title: 'Créer une conversation',
                    subtitle: "Création d'un flux bi-directionnel chiffré",
                },
                create_multi: {
                    title: 'Créer un groupe',
                    subtitle:
                        "Création d'un flux multi-directionnel non chiffré",
                },
                join_qr: {
                    title: 'Rejoindre avec un QRCode',
                    subtitle: 'Rejoindre un flux en scannant un QRCode reçu',
                },
                join_code: {
                    title: 'Rejoindre avec un code',
                    subtitle: 'Rejoindre un flux en tapant un code reçu',
                },
            },
            data: {
                encrypted: 'Message chiffré',
                uncryption: 'Déchiffrement',
            },
        },
        disconnect: 'Déconnexion',
    },
    messenger: {
        security: {
            title: 'Sécurité du flux',
            mode: {
                snap: {
                    alert: 'Êtes-vous sûr de vouloir changer de mode ? Tout vos messages seront effacés.',
                },
                messenger: {
                    alert: 'Ëtes-vous sur de vouloir changer de mode ? Le mode messagerie est moins sécurisé.',
                },
            },
        },
    },
    settings: {
        title: 'Paramètres',
        profile: {
            title: 'Profil',
        },
        security: {
            title: 'Sécurité',
        },
        subscription: {
            title: 'Abonnement',
        },
        dons: {
            title: 'Faire un don',
        },
    },
    placeholder: {
        choose_nickname: 'Entrez un pseudo',
        choose_password: 'Entrez un mot de passe',
        confirm_password: 'Confirmez mot de passe',
        your_email: 'Entrez votre e-mail',
        your_mobile_phone: 'Votre n° mobile',
        your_password: 'Votre mot de passe',
        your_message: 'Votre message',
    },
    common: {
        back: 'Retour',
        continue: 'Continuer',
        validate: 'Valider',
        cancel: 'Annuler',
        or: 'ou',
        you: 'Vous',
        messenger: 'Messagerie',
        yes: 'Oui',
        no: 'Non',
    },
};
