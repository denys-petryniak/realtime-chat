import { ref } from 'vue';
import type { Ref } from 'vue';
import type { RecordingData, MediaRecorderComposable } from '@/types';

export function useMediaRecorder(): MediaRecorderComposable {
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const recordedChunks = ref<Blob[]>([]);

  const recordingData: Ref<RecordingData> = ref({
    blob: null,
    recording: false,
    error: null,
  });

  const handleDataAvailable = (event: BlobEvent) => {
    recordedChunks.value.push(event.data);
  };

  const handleStop = () => {
    const recordedBlob = new Blob(recordedChunks.value, {
      type: 'audio/mp3',
    });
    mediaRecorder.value = null;

    if (recordedBlob.size === 0) {
      recordingData.value = {
        error: new Error('Empty recording'),
      };

      return;
    }

    recordingData.value = {
      blob: recordedBlob,
      recording: false,
    };

    recordedChunks.value = [];
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const options = [
        { mimeType: 'audio/webm' },
        { mimeType: 'audio/ogg' },
        { mimeType: 'audio/mpeg' },
        { mimeType: 'audio/wav' },
        { mimeType: 'audio/mp3' },
        { mimeType: 'audio/mp4' },
        { mimeType: 'audio/aac' },
        { mimeType: 'audio/x-aiff' },
        { mimeType: 'audio/webm;codecs=opus' },
        { mimeType: 'audio/webm;codecs=pcm' },
        { mimeType: 'audio/ogg;codecs=opus' },
        { mimeType: 'audio/mp4;codecs=mp4a' },
      ];

      const supportedOption = options.find((option) =>
        MediaRecorder.isTypeSupported(option.mimeType)
      );

      if (supportedOption) {
        mediaRecorder.value = new MediaRecorder(stream, supportedOption);
      } else {
        console.error('None of the supported MIME types are available');
      }

      mediaRecorder.value?.addEventListener(
        'dataavailable',
        handleDataAvailable
      );
      mediaRecorder.value?.addEventListener('stop', handleStop);

      recordingData.value = {
        recording: true,
      };

      mediaRecorder.value?.start();
    } catch (error) {
      console.error('Error accessing microphone', error);

      recordingData.value = {
        blob: null,
        recording: false,
        error: error as Error | null,
      };
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
      mediaRecorder.value.stop();

      recordingData.value = {
        recording: false,
      };
    }
  };

  return {
    recordingData,
    startRecording,
    stopRecording,
  };
}
