export const emailHTML = (name_, url) => {
  /** return HTML as string
   */
  return `
  <!DOCTYPE html>
<html xml:lang="en" lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <!--yahoo fix-->
</head>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <meta name="x-apple-disable-message-reformatting">

    <!--target dark mode-->
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark only">

    <title>Password Reset Information</title>

    <!-- Allow for better image rendering on Windows hi-DPI displays. -->
    <!--[if mso]>
<noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
</noscript>
<![endif]-->

    <!--to support dark mode meta tags-->
    <style type="text/css">
        :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
        }
    </style>

    <style>
        body {
            margin: 0;
            padding: 0;
        }

        table {
            border-collapse: collapse;
            mso-table-lspace: 0;
            mso-table-rspace: 0;
        }

        h1 {
            margin: 0.67em 0;
            font-size: 2em;
        }

        h2 {
            margin: 0.83em 0;
            font-size: 1.5em;
        }

        html[dir] h3,
        h3 {
            margin: 1em 0;
            font-size: 1.17em;
        }

        span.MsoHyperlinkFollowed {
            color: inherit !important;
            mso-style-priority: 99 !important;
        }

        #root [x-apple-data-detectors=true],
        a[x-apple-data-detectors=true] {
            color: inherit !important;
            text-decoration: inherit !important;
        }

        [x-apple-data-detectors-type="calendar-event"] {
            color: inherit !important;
            -webkit-text-decoration-color: inherit !important;
        }

        u+.body a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-weight: inherit;
            line-height: inherit;
        }

        .body {
            word-wrap: normal;
            word-spacing: normal;
        }

        div[style*="margin: 16px 0"] {
            margin: 0 !important;
        }

        #message * {
            all: revert
        }
    </style>


    <style>
        body {
            height: 100% !important;
            width: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        img {
            border: 0;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            display: block;
        }

        p,
        h1,
        h2,
        h3,
        h4 {
            padding: 0;
            margin: 0;
        }

        p,
        h1,
        h2,
        h3,
        img,
        ul li span {
            color: #0a080b;
        }

        p,
        h1,
        h2,
        h3,
        a,
        ul,
        img,
        ul li span {
            font-family: 'Trebuchet MS', Arial, sans-serif;
        }

        ul li {
            font-size: 28px !important;
            line-height: 28px !important;
        }

        ol li {
            font-size: 18px !important;
        }

        h1 {
            font-size: 36px;
            line-height: 46px;
        }

        h1.jumbo {
            font-size: 60px;
            line-height: 70px;
        }

        h2 {
            font-size: 30px;
            line-height: 40px;
        }

        h3 {
            font-size: 24px;
            line-height: 34px;
        }

        h4 {
            font-size: 18px;
            line-height: 24px;
        }

        p,
        img {
            font-size: 18px;
            line-height: 28px;
        }

        p.subhead {
            font-size: 30px;
            line-height: 40px;
        }

        p.sm_subhead {
            font-size: 24px;
            line-height: 34px;
        }

        ul li span {
            font-size: 18px;
            line-height: 28px;
        }

        h1 a,
        h2 a,
        h3 a,
        h4 a {
            color: #0a080b !important;
            text-decoration: none !important;
        }

        a,
        .link {
            color: #028383 !important;
            text-decoration: underline !important;
        }

        .dark a {
            color: #ffffff !important;
        }

        a:hover,
        .link:hover {
            text-decoration: none !important;
        }

        .fadeimg {
            transition: 0.3s !important;
            opacity: 1 !important;
        }

        .fadeimg:hover {
            transition: 0.3s !important;
            opacity: 0.5 !important;
        }

        /* start CTA HOVER EFFECTS */
        a.cta {
            text-decoration: none !important;
        }

        .cta {
            transition: 0.3s !important;
        }

        .cta span {
            transition: 0.3s !important;
            color: #ffffff;
        }

        .cta:hover {
            transition: 0.5s !important;
            background-color: #004265 !important;
            transform: scale(1.05);
        }

        .cta:hover span {
            transition: 0.3s !important;
        }

        .cta-border:hover {
            border-bottom: 3px solid transparent !important;
        }

        /* end CTA HOVER EFFECTS */

        .footer p {
            font-size: 14px;
            line-height: 24px;
            color: #4B525D;
        }

        .footer a {
            color: #4B525D !important;
        }

        .footer-dark p {
            font-size: 14px;
            line-height: 24px;
            color: #fefefe;
        }

        .footer-dark a {
            color: #fefefe !important;
        }

        .mobile {
            display: none !important;
        }

        .mob-inline {
            display: none !important;
        }

        .dark-img {
            display: none !important;
        }

        .blueLinks a {
            color: inherit !important;
            text-decoration: none !important;
        }
    </style>
    <style>
        u+.body .gmail-screen {
            background: #000;
            mix-blend-mode: screen;
            display: block;
        }

        u+.body .gmail-difference {
            background: #000;
            mix-blend-mode: difference;
            display: block;
        }

        u+.body .cta:hover .gmail-screen {
            background: transparent;
            mix-blend-mode: normal;
        }

        u+.body .cta:hover .gmail-difference {
            background: transparent;
            mix-blend-mode: normal;
        }
    </style>
    <!--mobile styles-->
    <style>
        @media screen and (max-width:600px) {
            .wMobile {
                width: 95% !important;
            }

            .wInner {
                width: 85% !important;
            }

            .wFull {
                width: 100% !important;
            }

            .desktop {
                width: 0 !important;
                display: none !important;
            }

            .mobile {
                display: block !important;
            }

            .mob-inline {
                display: inline-block !important;
            }

            h1 {
                font-size: 36px !important;
                line-height: 46px !important;
            }

            .subhead {
                font-size: 24px !important;
                line-height: 34px !important;
            }
        }
    </style>
    <style>
        @media (prefers-color-scheme: dark) {

            .dark-img {
                display: block !important;
            }

            .light-img {
                display: none;
                display: none !important;
            }

            .darkmode {
                background-color: #354D3D !important;
            }

            /* .darkmode {
                background: #262524 !important;
            } */

            .darkmode2 {
                background-color: #19201b !important;
            }

            /* .darkmode2 {
                background: #0e0e0e !important;
            } */

            h1,
            h2,
            h3,
            p,
            span,
            .plainTxt li,
            h1 a,
            h2 a,
            h3 a,
            .header a,
            img,
            strong {
                color: #EDEEEF !important;
            }

            a,
            .link {
                color: #7EABCE !important;
            }

            .footer .link,
            .footer a {
                color: #fdfdfd !important;
            }
        }

        [data-ogsc] .dark-img {
            display: block !important;
        }

        [data-ogsc] .light-img {
            display: none;
            display: none !important;
        }

        [data-ogsb] .darkmode {
            background-color: #272623 !important;
        }

        [data-ogsb] .darkmode2,
        [data-ogsb] .callout {
            background-color: #0e0e0e !important;
        }

        [data-ogsc] h1,
        [data-ogsc] h2,
        [data-ogsc] h3,
        [data-ogsc] p,
        [data-ogsc] span,
        [data-ogsc] .plainTxt li,
        [data-ogsc] h1 a,
        [data-ogsc] h2 a,
        [data-ogsc] h3 a,
        [data-ogsc] .header a,
        [data-ogsc] .footer a,
        [data-ogsc] img,
        [data-ogsc] strong {
            color: #EDEEEF !important;
        }

        [data-ogsc] .link,
        [data-ogsc] p a {
            color: #7EABCE !important;
        }

        [data-ogsc] .footer a {
            color: #fdfdfd !important;
        }
    </style>

    <!--fix for Outlook bullet points-->
    <style>
        u+.body .glist {
            margin-left: 15px !important;
        }

        @media only screen and (max-width: 640px) {
            u+.body .glist {
                margin-left: 25px !important;
            }
        }
    </style>

    <!--[if (gte mso 9)|(IE)]>
<style>
li { 
margin-left:27px !important;
mso-special-format: bullet;
}
.forDumbOutlooks {
margin-left: -25px !important;
}
</style>
<![endif]-->
</head>

<body id="body" class="darkmode2 body" bgcolor="#EDEEEF" style="background-color:#EDEEEF;">
    <div role="article" aria-roledescription="email" aria-label="Email from Your Company" xml:lang="en" lang="en">
        <!--hidden preheader with pre-header spacer hack-->
        <div class="litmus-builder-preview-text" style="display:none;">Log in to your Litmus account to check your ESP
            integration settings.
            &#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;
        </div>
        <!--start of email-->
        <table class="darkmode2" cellpadding="0" cellspacing="0" border="0" role="presentation"
            style="width:100%; background-color: #f8f9fc;">
            <tr>
                <td class="darkmode" align="center" valign="top"
                    style="background-color: #354D3D; background: linear-gradient(#354D3D,#354D3D);">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                            <td align="center" valign="top" style="padding: 30px 0;">
                                <!--Header with logo-->

                                <!--light mode logo-->
                                <a href="https://lisa.goweki.com" target="_blank">
                                    <img src="https://i.postimg.cc/1XLT7Kn4/email-HTML-letterhead-168px.jpg" width="168"
                                        height="78" alt="LISA"
                                        style="color: #4a4a4a; text-align:center; font-weight:bold; font-size:24px; line-height:28px;border-radius: 25px;"
                                        border="0" />
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" valign="top" style="padding-top: 60px;">
                    <table class="wMobile darkmode dark-border" border="0" cellpadding="0" cellspacing="0"
                        role="presentation" style="width: 600px; background-color: #ffffff; border: 1px solid #DADDDE;">
                        <tr>
                            <td align="center" valign="top">
                                <table class="wInner" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                    style="width:500px;">
                                    <tr>
                                        <td align="center" valign="top" style="padding: 60px 30px 0;">
                                            <!--h1-->
                                            <h1>Password Reset Info</h1>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="left" valign="top" style="padding: 50px 0 0;">
                                            <div class="mktoText" id="body_copy" mktoname="body_copy">
                                                <!--Paragraph block-->
                                                <p style="text-align: left;">${name_}, we received a request to
                                                    reset your password. Click the button below to set a new password;
                                                    or alternatively use the link: ${url}</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" valign="top" style="padding: 50px 0 0;">
                                            <a href="${url}" class="cta"
                                                style="background-color: #19201b; font-size: 18px; font-family: 'Trebuchet MS', Arial, sans-serif; font-weight:bold; text-decoration: none; padding: 14px 20px; color: #ffffff; display:inline-block; mso-padding-alt:0;"><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%;mso-text-raise:30pt">&nbsp;</i><![endif]--><span
                                                    style="mso-text-raise:15pt;"><span class="gmail-screen"><span
                                                            class="gmail-difference">Reset your
                                                            password</span></span></span><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%">&nbsp;</i><![endif]--></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" valign="top" style="padding: 50px 0 0;">
                                            <!--Paragraph block-->
                                            <p style="text-align: left;"><strong>This link will expire in 1
                                                    hour.</strong> If you did not request a new password, please
                                                disregard this message.<br /><br /><strong>Questions?</strong> Contact
                                                <a href="mailto:lisa@goweki.com">lisa@goweki.com</a>.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td aria-hidden="true" align="left" valign="top"
                                            style="font-size:60px;line-height:60px;mso-line-height-rule: exactly;">
                                            &nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>

            <!--footer-->
            <tr>
                <td align="center" style="padding: 0px 15px;">
                    <table role="presentation" class="wMobile" cellpadding="0" cellspacing="0" border="0"
                        style="width: 600px; max-width: 600px;">
                        <tr>
                            <td class="footer" align="center" valign="top" style="padding:50px 30px;">
                                <!--Footer-->
                                <p style="margin:0 auto 20px;">
                                    You&rsquo;re receiving this email because you have an account with us.
                                </p>
                                <p style="mso-line-height-rule:exactly;margin-bottom:20px;">
                                    <a href="https://linkedin.com/company/lisa-techassistant" class="link"
                                        target="_blank" style="color: #0a080b; text-decoration: underline;">LinkedIn</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
    <!--analytics-->

</body>

</html>
`;
};

export const emailPlaintext = (
  title,
  parag1,
  parag1_quoted = def_parag1Quot,
  url = def_url,
  parag2 = def_parag2,
  parag3 = def_parag3
) => {
  /** return HTML as string
   */
  return `
    
${title}

${parag1} ${parag1_quoted}

${url}

${parag2}
${parag3}

LISA.
https://lisa.goweki.com

© 2024 GOWEKI. All rights reserved.
`;
};

/** TEMPLATES
 *
 */

/**
 * 1
 */

// <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>New Template</title> <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
// <![endif]--><style type="text/css">.rollover:hover .rollover-first { max-height:0px!important; display:none!important; } .rollover:hover .rollover-second { max-height:none!important; display:block!important; } .rollover span { font-size:0px; } u + .body img ~ div div { display:none; } #outlook a { padding:0; } span.MsoHyperlink,span.MsoHyperlinkFollowed { color:inherit; mso-style-priority:99; } a.es-button { mso-style-priority:100!important; text-decoration:none!important; } a[x-apple-data-detectors] { color:inherit!important; text-decoration:none!important; font-size:inherit!important; font-family:inherit!important; font-weight:inherit!important; line-height:inherit!important; } .es-desk-hidden { display:none; float:left; overflow:hidden; width:0; max-height:0; line-height:0; mso-hide:all; } .es-button-border:hover > a.es-button { color:#ffffff!important; }
// @media only screen and (max-width:600px) {*[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important }
//  .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important }
//  .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover span, .es-m-txt-c .rollover span, .es-m-txt-l .rollover span { line-height:0!important; font-size:0!important } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:20px!important; line-height:120%!important } a.es-button, button.es-button, .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important }
//  .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .es-social td { padding-bottom:10px } .h-auto { height:auto!important } }
// @media screen and (max-width:384px) {.mail-message-content { width:414px!important } }</style>
//  </head> <body class="body" style="width:100%;height:100%;padding:0;Margin:0"><div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#fafafa"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA"><tr><td valign="top" style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"><tr>
// <td align="center" style="padding:0;Margin:0"><table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr><td align="left" style="padding:0;Margin:0;padding-top:15px;padding-right:20px;padding-left:20px"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
// <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0px"><img src="https://fhznwwv.stripocdn.email/content/guids/CABINET_b9cf3e075becc0ecaf30161affe5362ff454e87b4c9dee788d1b0dfe45ab3630/images/image.png" alt="" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" width="100" class="adapt-img"></td> </tr><tr><td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><h1 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:46px;font-style:normal;font-weight:bold;line-height:55px;color:#333333">Thanks for joining us!</h1></td></tr><tr>
// <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:24px;letter-spacing:0;color:#333333;font-size:16px">Hello, *|FNAME|*! Thanks for joining us! You are now on our mailing list. This means you'll be the first&nbsp;to hear about our fresh&nbsp;collections and offers!</p></td></tr></table></td></tr></table></td></tr> <tr><td class="esdev-adapt-off" align="left" style="padding:20px;Margin:0"><table cellpadding="0" cellspacing="0" class="esdev-mso-table" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px"><tr>
// <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr class="es-mobile-hidden"><td align="left" style="padding:0;Margin:0;width:146px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" height="40" style="padding:0;Margin:0"></td></tr></table></td></tr></table></td> <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr>
// <td align="left" style="padding:0;Margin:0;width:121px"><table cellpadding="0" cellspacing="0" width="100%" bgcolor="#e8eafb" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#e8eafb;border-radius:10px 0 0 10px" role="presentation"><tr><td align="right" style="padding:0;Margin:0;padding-top:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Login:</p></td></tr> <tr><td align="right" style="padding:0;Margin:0;padding-bottom:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Password:</p></td></tr></table></td></tr></table></td>
//  <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr><td align="left" style="padding:0;Margin:0;width:155px"><table cellpadding="0" cellspacing="0" width="100%" bgcolor="#e8eafb" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#e8eafb;border-radius:0 10px 10px 0" role="presentation"><tr><td align="left" style="padding:0;Margin:0;padding-top:10px;padding-left:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>USER-1000</strong></p></td></tr> <tr>
// <td align="left" style="padding:0;Margin:0;padding-bottom:10px;padding-left:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>FYTerg243okr</strong></p></td></tr></table></td></tr></table></td><td class="esdev-mso-td" valign="top" style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" class="es-right" align="right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr class="es-mobile-hidden"><td align="left" style="padding:0;Margin:0;width:138px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" height="40" style="padding:0;Margin:0"></td> </tr></table></td></tr></table></td></tr></table>
// </td></tr> <tr><td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-bottom:10px"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-radius:5px" role="presentation"><tr>
// <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#5C68E2;border-width:0px;display:inline-block;border-radius:6px;width:auto"><a href="" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#5C68E2;border-radius:6px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:24px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #5C68E2;border-left-width:30px;border-right-width:30px">SHOP NOW</a> </span></td></tr><tr>
// <td align="left" style="padding:0;Margin:0;padding-bottom:10px;padding-top:20px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Got a question? Email us at&nbsp;<a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:underline;color:#5C68E2;font-size:14px">support@</a><a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:underline;color:#5C68E2;font-size:14px">stylecasual</a><a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:underline;color:#5C68E2;font-size:14px">.com</a>&nbsp;or give us a call at&nbsp;<a target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#5C68E2;font-size:14px;line-height:21px" href="">+000 123 456</a>.</p>
//  <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><br>Thanks,</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">The Style Casual&nbsp;Team!</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table> <table cellpadding="0" cellspacing="0" class="es-footer" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top"><tr>
// <td align="center" style="padding:0;Margin:0"><table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:640px" role="none"><tr><td align="left" style="Margin:0;padding-right:20px;padding-left:20px;padding-top:20px;padding-bottom:20px"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0;width:600px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
// <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;font-size:0"><table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><img title="Facebook" src="https://fhznwwv.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" alt="Fb" width="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td> <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><img title="X.com" src="https://fhznwwv.stripocdn.email/content/assets/img/social-icons/logo-black/x-logo-black.png" alt="X" width="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
// <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><img title="Instagram" src="https://fhznwwv.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Inst" width="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td><td align="center" valign="top" style="padding:0;Margin:0"><img title="Youtube" src="https://fhznwwv.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png" alt="Yt" width="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td></tr></table></td></tr> <tr><td align="center" style="padding:0;Margin:0;padding-bottom:35px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">Style Casual&nbsp;© 2021 Style Casual, Inc. All Rights Reserved.</p>
// <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">4562 Hazy Panda Limits, Chair Crossing, Kentucky, US, 607898</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table> <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"><tr><td class="es-info-area" align="center" style="padding:0;Margin:0"><table class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" bgcolor="#FFFFFF" role="none"><tr>
// <td align="left" style="padding:20px;Margin:0"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
// <td align="center" class="es-infoblock" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#CCCCCC;font-size:12px"><a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a>No longer want to receive these emails?&nbsp;<a href="" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px">Unsubscribe</a>.<a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a></p> </td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>
