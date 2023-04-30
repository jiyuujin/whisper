import { APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as FormData from 'form-data'
import fetch from 'node-fetch'

const OPENAI_AUDIO_TRANSCRIPTIONS_API = 'https://api.openai.com/v1/audio/transcriptions'
const OPENAI_SECRET = ''

export const audioTranscriptions = async (file, object): Promise<string> => {
  const body = new FormData()
  body.append('model', 'whisper-1')
  body.append('file', file, {
    contentType: object.ContentType,
    knownLength: object.ContentLength,
    filename: file['Key'],
  })

  const res = await fetch(OPENAI_AUDIO_TRANSCRIPTIONS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${OPENAI_SECRET}`,
    },
    body,
  })
  const data = await res.json()

  return data.text
};

export const hello: APIGatewayProxyHandler = async (event) => {
  const reqBody = event['Records'][0]
  const key = decodeURIComponent(reqBody.s3.object.key.replace(/\+/g, ' '))

  const s3 = new AWS.S3({
    region:'ap-northeast-1',
  })

  const s3Params = {
    Bucket: 'openai-whisper-bucket',
    ACL: 'public-read',
  }

  let title = ''

  try {
    s3.headObject({ ...s3Params, Key: key }, (err, output) => {
      if (err) return

      const s3Stream = s3.getObject({ ...s3Params, Key: key })
        .createReadStream()

      const res = audioTranscriptions(s3Stream, output)
      title = res.content
    })

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          text: title,
        },
        null,
        2,
      ),
    }
  } catch (err) {
    return {
      statusCode: 401,
      body: JSON.stringify(
        {
          text: err || 'Something is wrong.',
        },
        null,
        2,
      ),
    }
  }
}
