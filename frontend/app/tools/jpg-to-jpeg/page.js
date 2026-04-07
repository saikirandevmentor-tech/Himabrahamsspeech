import ImageConverter from '@/components/ImageConverter';

export default function JpgToJpeg() {
  return (
    <ImageConverter
      fromFormat="JPG"
      toFormat="JPEG"
      fromMime="image/jpeg"
      toExt="jpeg"
      accentColor="#e65100"
      bgColor="#fff3e0"
      endpoint="/api/tools/jpg-to-jpeg"
    />
  );
}
