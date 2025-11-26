import { Footer } from "@/All/components/footer";
import Header from "@/All/components/header";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    (<div className="bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-primary mb-6">Política de Privacidad</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Tu privacidad es importante para nosotros. En esta política de privacidad, te explicamos qué datos
            personales recogemos de nuestros usuarios y cómo los utilizamos. Te animamos a leer detenidamente estos
            términos antes de facilitar tus datos personales en esta web.
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Regulaciones que cumple esta política</h2>
              <p className="mb-4">
                PecinoGP ha adecuado esta web a las exigencias del Reglamento (UE) 2016/679 del Parlamento Europeo y del
                Consejo de 27 de abril de 2016 relativo a la protección de las personas físicas (RGPD), así como con la
                Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSICE
                o LSSI).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Uso de Servicios de Terceros</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Servicios de API de YouTube</h3>
                <p>Este cliente API utiliza los Servicios de API de YouTube.</p>
                <p>
                  Al utilizar nuestro servicio, los usuarios aceptan estar sujetos a la{' '}
                  <Link
                    href="http://www.google.com/policies/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Política de Privacidad de Google
                  </Link>.
                </p>
                <p>
                  No recopilamos datos personales a través de la API de YouTube, pero el cliente puede almacenar información técnica o cookies en su dispositivo para el correcto funcionamiento.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Responsable del tratamiento de tus datos</h2>
              <ul className="list-disc list-inside mb-4 pl-4">
                <li>
                  <strong>Responsable:</strong> Manuel Pecino
                </li>
                <li>
                  <strong>Correo electrónico:</strong> manuel.pecino@pecinogp.com
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Principios que aplicamos a tu información</h2>
              <p className="mb-4">
                En el tratamiento de tus datos personales, aplicaremos los siguientes principios que se ajustan a las
                exigencias del nuevo reglamento europeo de protección de datos:
              </p>
              <ul className="list-disc list-inside mb-4 pl-4 space-y-2">
                <li>
                  <strong>Principio de licitud, lealtad y transparencia:</strong> Siempre vamos a requerir tu consentimiento para el
                  tratamiento de tus datos personales para uno o varios fines específicos que te informaremos previamente
                  con absoluta transparencia.
                </li>
                <li>
                  <strong>Principio de minimización de datos:</strong> Solo vamos a solicitar datos estrictamente necesarios en relación
                  con los fines para los que los requerimos.
                </li>
                <li>
                  <strong>Principio de limitación del plazo de conservación:</strong> los datos serán mantenidos durante no más tiempo del
                  necesario para los fines del tratamiento.
                </li>
                <li>
                  <strong>Principio de integridad y confidencialidad:</strong> Tus datos serán tratados de tal manera que se garantice una
                  seguridad adecuada de los datos personales y se garantice confidencialidad.
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Información de Contacto</h2>
              <p className="mb-4">
                Si tienes alguna pregunta sobre esta Política de Privacidad o sobre el tratamiento de tus datos, puedes contactarnos en la siguiente dirección de correo electrónico:
              </p>
              <p>
                <a href="mailto:contacto@pecinogp.es" className="text-primary hover:underline">
                  contacto@pecinogp.es
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Aceptación y consentimiento</h2>
              <p className="mb-4">
                El usuario declara haber sido informado de las condiciones sobre protección de datos de carácter
                personal, aceptando y consintiendo el tratamiento de los mismos por parte de PecinoGP en la forma y
                para las finalidades indicadas en esta política de privacidad.
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>)
  );
}