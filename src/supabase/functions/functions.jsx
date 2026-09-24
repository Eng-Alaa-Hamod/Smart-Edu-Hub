import { supabase, BUCKET_NAME, AVATAR_FOLDER } from "../supabase";

export const uploadAvatar = async (file, userId) => {
  try {
    if (!file) throw new Error("No file provided");
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${AVATAR_FOLDER}/${userId}/images/${fileName}`;

    const { error } = await supabase.storage
      .from(AVATAR_FOLDER)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(AVATAR_FOLDER)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

export const deleteAvatar = async (userId, fileName) => {
  try {
    const filePath = `${AVATAR_FOLDER}/${userId}/images/${fileName}`;
    const { error } = await supabase.storage
      .from(AVATAR_FOLDER)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting avatar:", error);
    throw error;
  }
};

export const uploadFile = async (file, userId) => {
  try {
    if (!file) throw new Error("No file provided");
    
    if (file.type !== "application/pdf") {
      throw new Error("Only PDF files are allowed");
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/pdfs/${fileName}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const uploadLibraryImage = async (file, userId) => {
  if (!file) throw new Error("No image provided");
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/library/${Date.now()}.${fileExt}`;
  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  return supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath).data.publicUrl;
};

export const deleteFile = async (userId, fileName) => {
  try {
    const filePath = `${userId}/pdfs/${fileName}`;
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const deleteFileByUrl = async (fileUrl) => {
  if (!fileUrl) return;
  const marker = `/object/public/${BUCKET_NAME}/`;
  const filePath = fileUrl.split(marker)[1];
  if (!filePath) return;

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
  if (error) throw error;
};

export const uploadCourseCover = async (file, teacherId) => {
  if (!file) return "";

  
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload a valid image file.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${teacherId}_cover_${Date.now()}.${fileExt}`;
  const filePath = `covers/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }
  
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return data.publicUrl;
};