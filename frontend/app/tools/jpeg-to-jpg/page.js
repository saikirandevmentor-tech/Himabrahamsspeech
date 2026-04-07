import ImageConverter from '@/components/ImageConverter';

export default function JpegToJpg() {
  return (
    <ImageConverter
      fromFormat="JPEG"
      toFormat="JPG"
      fromMime="image/jpeg"
      toExt="jpg"
      accentColor="#0277bd"
      bgColor="#e1f5fe"
      endpoint="/api/tools/jpeg-to-jpg"
    />
  );
}
