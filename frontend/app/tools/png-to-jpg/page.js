import ImageConverter from '@/components/ImageConverter';

export default function PngToJpg() {
  return (
    <ImageConverter
      fromFormat="PNG"
      toFormat="JPG"
      fromMime="image/png"
      toExt="jpg"
      accentColor="#00695c"
      bgColor="#e0f2f1"
      endpoint="/api/tools/png-to-jpg"
    />
  );
}
