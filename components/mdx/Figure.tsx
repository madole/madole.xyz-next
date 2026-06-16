export interface FigureProps {
  image: string;
  alt: string;
  caption?: string;
}

export default function Figure({ image, alt, caption }: FigureProps) {
  return (
    <figure className="my-6 flex flex-col items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={alt} className="rounded-lg max-w-full" />
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-slate-500">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
