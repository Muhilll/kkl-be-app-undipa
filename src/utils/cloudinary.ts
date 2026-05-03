import { v2 as cloudinary } from "cloudinary";

const DEFAULT_CLOUDINARY_FOLDER = "uploads";

function getCloudinaryUrl() {
  return process.env.CLOUDINARY_URL;
}

function getCloudinaryFolder(target?: string) {
  if (target === "mahasiswa" && process.env.CLOUDINARY_FOLDER_MAHASISWA) {
    return process.env.CLOUDINARY_FOLDER_MAHASISWA;
  }
  if (target === "dosen" && process.env.CLOUDINARY_FOLDER_DOSEN) {
    return process.env.CLOUDINARY_FOLDER_DOSEN;
  }
  if (target === "laporan" && process.env.CLOUDINARY_FOLDER_LAPORAN) {
    return process.env.CLOUDINARY_FOLDER_LAPORAN;
  }
  return process.env.CLOUDINARY_FOLDER || DEFAULT_CLOUDINARY_FOLDER;
}

function parseCloudinaryUrl(cloudinaryUrl: string) {
  const parsedUrl = new URL(cloudinaryUrl);
  const cloudName = parsedUrl.hostname;
  const apiKey = decodeURIComponent(parsedUrl.username);
  const apiSecret = decodeURIComponent(parsedUrl.password);

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Invalid Cloudinary URL configuration");
  }

  return {
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  };
}

function configureCloudinary() {
  const cloudinaryUrl = getCloudinaryUrl();

  if (!cloudinaryUrl) {
    throw new Error("CLOUDINARY_URL is not configured");
  }

  cloudinary.config(parseCloudinaryUrl(cloudinaryUrl));
}

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

export type CloudinarySignedUploadParams = {
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: number;
  uploadUrl: string;
};

export function createSignedUploadParams(target?: string): CloudinarySignedUploadParams {
  const cloudinaryUrl = getCloudinaryUrl();

  if (!cloudinaryUrl) {
    throw new Error("CLOUDINARY_URL is not configured");
  }

  const config = parseCloudinaryUrl(cloudinaryUrl);
  const folder = getCloudinaryFolder(target);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      folder,
      timestamp,
    },
    config.api_secret,
  );

  return {
    apiKey: config.api_key,
    cloudName: config.cloud_name,
    folder,
    signature,
    timestamp,
    uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloud_name}/auto/upload`,
  };
}

export async function deleteImageFromCloudinary(
  publicId: string | null | undefined,
) {
  if (!publicId) {
    return;
  }

  configureCloudinary();
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
}

export async function deleteImageFromCloudinarySafely(
  publicId: string | null | undefined,
) {
  try {
    await deleteImageFromCloudinary(publicId);
  } catch (error) {
    console.error(
      `[Cloudinary] Failed to delete image "${publicId}":`,
      error,
    );
  }
}
