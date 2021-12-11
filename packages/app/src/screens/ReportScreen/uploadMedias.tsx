import FormData from 'form-data';
import { SERVER_BASE_URL } from '~/shared/config';

// TODO: retornar s3 url de cada media
export const uploadMedias = async (medias: { uri: string; }[]) => {
  const form = medias.reduce<FormData>((form, media, idx) => {
    const imageKey = `image-${idx}`;
    form.append(imageKey, {
      uri: media.uri,
      name: imageKey,
      type: 'image/jpeg',
    });
    return form;
  }, new FormData());

  const response = await fetch(`${SERVER_BASE_URL}/uploads`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: form,
  });
  const bodyRes = await response.json();
  console.log('uploaded to the server, response: ' + JSON.stringify(bodyRes));
  return [] as string[];
};
