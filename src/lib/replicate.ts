import Replicate from "replicate";

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// cuuupid/idm-vton — chosen over CatVTON/StableVITON for this build (see
// BRIEF): CC BY-NC-SA license, 1.5M+ runs on Replicate. Pinning the exact
// version so a model update upstream can't silently change output shape.
export const VTON_MODEL_VERSION =
  "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";

export async function uploadImageToReplicate(bytes: Buffer, filename: string) {
  const file = await replicate.files.create(bytes, { filename });
  return file.urls.get;
}
