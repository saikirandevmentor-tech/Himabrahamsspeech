import ImageConverter from '@/components/ImageConverter';

export default function JpgToPng() {
  return (
    <ImageConverter
      fromFormat="JPG"
      toFormat="PNG"
      fromMime="image/jpeg"
      toExt="png"
      accentColor="#6a1b9a"
      bgColor="#f3e5f5"
      endpoint="/api/tools/jpg-to-png"
    />
  );
}
