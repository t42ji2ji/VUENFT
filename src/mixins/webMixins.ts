import { ref } from 'vue';

export default function() {
  const errorText = ref<string>('');
  return { errorText };
}
