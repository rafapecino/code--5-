import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { YouTubeVideo, getVideoEmbedUrl } from "@/lib/youtube-service";

// This is now a Server Component, receiving data via props
export function LatestVideo({ latestVideo }: { latestVideo: YouTubeVideo | null }) {
  
  if (!latestVideo) {
    return (
        <Card className="w-full bg-card/50 backdrop-blur-sm border-border/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Último Vídeo de Pecino GP
          </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground">No se pudo cargar el último vídeo.</p>
        </CardContent>
      </Card>
    );
  }
  
    // Handle the case where the API returned an error object
  if (latestVideo.error) {
    return (
        <Card className="w-full bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-destructive">
                    Error al Cargar Vídeo
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">{latestVideo.description}</p>
            </CardContent>
        </Card>
    );
  }


  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-border/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Último Vídeo
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="w-full overflow-hidden rounded-lg aspect-video">
          <iframe
            src={getVideoEmbedUrl(latestVideo.id)}
            title={latestVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        <h3 className="mt-4 font-bold text-center text-lg text-foreground line-clamp-2">
          {latestVideo.title}
        </h3>
      </CardContent>
    </Card>
  );
}
