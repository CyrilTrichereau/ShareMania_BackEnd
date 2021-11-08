<template>
    <button
      class="validateButton"
    >
      {{ text }}
    </button>
</template>

<script>
export default {
  name: "ValidateButton",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
$primary: #4d7c8a;
$dark: #3c464e;
$light: #fdfeff;

.validateButton {
  padding: 0.5rem 2rem;
  font-family: "Source Sans Pro", "Trebuchet MS", sans-serif, "Times New Roman";
  background: $primary;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  color: $light;
  cursor: pointer;
  text-decoration: none;
  &:hover {
  background: $dark;

  }
}
</style>
