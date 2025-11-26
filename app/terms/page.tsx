import { Footer } from "@/All/components/footer";
import Header from "@/All/components/header";
import Link from "next/link";

export default function Terms() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-primary mb-6">Términos y Condiciones de Uso</h1>
          
          <div className="space-y-8">
            <div>
              <p className="text-lg text-muted-foreground mb-4">
                Bienvenido a PecinoGP. Estos términos y condiciones describen las reglas y regulaciones para el uso del
                sitio web de PecinoGP.
              </p>
              <p className="mb-4">
                Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones. No continúes usando
                PecinoGP si no estás de acuerdo con todos los términos y condiciones establecidos en esta página.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Servicios de Terceros</h2>
              <p className="mb-4">
                Al utilizar este sitio web y su contenido, el usuario acepta estar sujeto a los{' '}
                <Link
                  href="https://www.youtube.com/t/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Términos de Servicio de YouTube
                </Link>.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Cookies</h2>
              <p className="mb-4">
                Empleamos el uso de cookies. Al acceder a PecinoGP, aceptaste usar cookies de acuerdo con nuestra Política de
                Privacidad. La mayoría de los sitios web interactivos utilizan cookies para permitirnos recuperar los detalles del
                usuario para cada visita.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Licencia</h2>
              <p className="mb-4">
                A menos que se indique lo contrario, PecinoGP y/o sus licenciantes poseen los derechos de propiedad
                intelectual de todo el material en PecinoGP. Todos los derechos de propiedad intelectual son reservados.
                Puedes acceder a esto desde PecinoGP para tu propio uso personal sujeto a las restricciones establecidas
                en estos términos y condiciones.
              </p>
              <p className="font-semibold mb-2">No debes:</p>
              <ul className="list-disc list-inside mb-4 pl-4">
                <li>Volver a publicar material de PecinoGP.</li>
                <li>Vender, alquilar o sublicenciar material de PecinoGP.</li>
                <li>Reproducir, duplicar o copiar material de PecinoGP.</li>
                <li>Redistribuir contenido de PecinoGP.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Hipervínculos a nuestro contenido</h2>
              <p className="mb-4">
                Ciertas organizaciones pueden vincular a nuestro sitio web sin aprobación previa por escrito, como agencias gubernamentales, motores de búsqueda y organizaciones de noticias.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Reserva de Derechos</h2>
              <p className="mb-4">
                Nos reservamos el derecho de solicitar que elimines todos los enlaces o cualquier enlace particular a
                nuestro sitio web. Apruebas eliminar inmediatamente todos los enlaces a nuestro sitio web si así se te
                solicita. También nos reservamos el derecho de modificar estos términos y condiciones y su política de
                enlaces en cualquier momento.
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}