<script setup lang="ts">
import { useCurrentUser } from 'vuefire';

const user = useCurrentUser();
</script>

<template>
  <div>
    <slot name="user" :user="user"></slot>
  </div>
</template>
