export default {
    welcome: {
        emailSubject: "Bienvenido/a a Cafetería IES Profesor Tomas Hormigo",
        emailBody: [
            "Bienvenido/a {!user.name} {!user.lastName}",
            "",
            "\tNos alegra que se haya registrado como cliente en nuestra cafetería, por último es necesario validar y activar la cuenta de usuario.",
            "Para ello, haga click en el siguiente enlace",
            "{!urls.activate}",
            "",
            "Si usted no reconoce este mensaje y no se ha registrado como cliente en nuestra cafetería, haga click en el siguiente enlace:",
            "{!urls.revoke}",
            "Muchas Gracias por su registro",
            "Atentamente la Dirección de la Cafetería IES Profesor Tomas Hormigo"
        ],
        emailHTMLBody: [
            "<p>Bienvenido/a {!user.name} {!user.lastName}</p>",
            "",
            "<p>tNos alegra que se haya registrado como cliente en nuestra cafetería, por último es necesario validar y activar la cuenta de usuario.<br/>",
            "Para ello, haga click en el siguiente enlace</p>",
            "<a href=\"{!urls.activate}\">{!urls.activate}</a>",
            "",
            "<p>Si usted no reconoce este mensaje y no se ha registrado como cliente en nuestra cafetería, haga click en el siguiente enlace:</p>",
            "<a href=\"{!urls.revoke}\">{!urls.revoke}</a>",
            "<p>Muchas Gracias por su registro<br/>",
            "Atentamente la Dirección de la Cafetería IES Profesor Tomas Hormigo</p>"
        ]
    },
    recovery: {
        emailSubject: "Recuperación de Cuenta de la Cafetería IES Profesor Tomas Hormigo",
        emailBody: [
            "Hola {!user.name} {!user.lastName}, ",
            "",
            "Hemos recibido una solicitud de recuperación de cuenta para su usuario.Si la ha solicitado usted, haga click en el sigiente enlace:",
            "<a href=\"{!urls.recovery}\">{!urls.recovery}</a>",
            "",
            "Si no ha solicitado usted la recuperación de cuenta, ignore este mensaje.",
            "",
            "Atentamente la Dirección de la Cafetería IES Profesor Tomas Hormigo"
        ],
        emailHTMLBody: [
            "<p>Hola {!user.name} {!user.lastName},</p>",
            "",
            "<p>Hemos recibido una solicitud de recuperación de cuenta para su usuario.Si la ha solicitado usted, haga click en el sigiente enlace:</p>",
            "<a href=\"{!urls.recovery}\">{!urls.recovery}</a>",
            "",
            "<p>Si no ha solicitado usted la recuperación de cuenta, ignore este mensaje y disculpe las molestias.</p>",
            "",
            "<p>Atentamente la Dirección de la Cafetería IES Profesor Tomas Hormigo</p>"
        ]
    },
}