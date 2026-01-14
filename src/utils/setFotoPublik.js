function setFotoPublik(userPublik) {
  if (!userPublik) return null;
  const fotoImage = userPublik?.foto
    ? `/api/services/file/uploads/pemohon/${userPublik?.foto}`
    : userPublik?.image;
  return fotoImage;
}

export default setFotoPublik;
