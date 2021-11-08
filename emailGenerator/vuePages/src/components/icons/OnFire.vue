<template>
  <button
    class="fireIcon"
    :class="{
      fireIconIsOn: isActive && !infinite,
      fireIconIsOnInfinite: isActive && infinite,
      smallFireIcon: small,
    }"
  >
    <font-awesome-icon
      icon="fire-alt"
      class="fas fa-fire-alt fire fireFirst"
      :class="{ fireIsOn: isActive, smallFire: small }"
    />
    <font-awesome-icon
      icon="fire-alt"
      class="fas fa-fire-alt fire fireSecond"
      :class="{ fireIsOn: isActive, smallFire: small }"
    />
    <font-awesome-icon
      icon="fire-alt"
      class="fas fa-fire-alt fire fireThird"
      :class="{ fireIsOn: isActive, smallFire: small }"
    />
    <font-awesome-icon
      icon="fire-alt"
      class="fas fa-fire-alt fire fireFourth"
      :class="{ fireIsOn: isActive, smallFire: small }"
    />
    <font-awesome-icon
      icon="fire-alt"
      class="fas fa-fire-alt fire fireFifth"
      :class="{ fireIsOn: isActive, smallFire: small }"
    />
  </button>
</template>

<script>
export default {
  name: "OnFire",
  props: {
    small: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    infinite: {
      type: Boolean,
      defaut: false,
    },
  },
};
</script>

<style scoped lang="scss">
// General
$animationTime: 800ms;
$animationIterate: 4;
// Delay
$animationDelay: 150ms;
$animationDelayThird: 300ms;
$animationDelayFourth: 450ms;
$animationDelayFifth: 600ms;
// Rotate
$animationRotateFirst: -10deg;
$animationRotateSecond: -5deg;
$animationRotateThird: 0deg;
$animationRotateFourth: 5deg;
$animationRotateFifth: 10deg;
//Color
$colorLight: #fdfeff;
$colorDanger: #c02200;

.fireIcon {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 32px;
  width: 32px;
  padding: 35px;
  margin: 0;
  border-radius: 25px 25px 0 0;
  cursor: pointer;
  border: none;
  background: none;
  &:hover {
    & > .fire {
      &First {
        animation: $animationTime fireAnimationFirst ease-in-out infinite;
      }
      &Second {
        animation: $animationTime fireAnimationSecond $animationDelay
          ease-in-out infinite;
      }
      &Third {
        animation: $animationTime fireAnimationThird $animationDelayThird
          ease-in-out infinite;
      }
      &Fourth {
        animation: $animationTime fireAnimationFourth $animationDelayFourth
          ease-in-out infinite;
      }
      &Fifth {
        animation: $animationTime fireAnimationFifth $animationDelayFifth
          ease-in-out infinite;
      }
    }
  }
}
.smallFireIcon {
  height: 48px;
  width: 48px;
  padding: 10px;
}

.fireIconIsOn {
  background: $colorDanger;
  & > .fire {
    &First {
      animation: $animationTime fireAnimationFirst ease-in-out $animationIterate;
    }
    &Second {
      animation: $animationTime fireAnimationSecond $animationDelay ease-in-out
        $animationIterate;
    }
    &Third {
      animation: $animationTime fireAnimationThird $animationDelayThird
        ease-in-out $animationIterate;
    }
    &Fourth {
      animation: $animationTime fireAnimationFourth $animationDelayFourth
        ease-in-out $animationIterate;
    }
    &Fifth {
      animation: $animationTime fireAnimationFifth $animationDelayFifth
        ease-in-out $animationIterate;
    }
  }
}
.fireIconIsOnInfinite {
  background: $colorDanger;
  & > .fire {
    &First {
      animation: $animationTime fireAnimationFirst ease-in-out infinite;
    }
    &Second {
      animation: $animationTime fireAnimationSecond $animationDelay ease-in-out
        infinite;
    }
    &Third {
      animation: $animationTime fireAnimationThird $animationDelayThird
        ease-in-out infinite;
    }
    &Fourth {
      animation: $animationTime fireAnimationFourth $animationDelayFourth
        ease-in-out infinite;
    }
    &Fifth {
      animation: $animationTime fireAnimationFifth $animationDelayFifth
        ease-in-out infinite;
    }
  }
}

.fire {
  font-size: 2rem;
  position: absolute;
  bottom: 10%;
  transform-origin: bottom;
  color: $colorDanger;
  &Second {
    opacity: 0;
  }
  &Third {
    opacity: 0;
  }
  &Fourth {
    opacity: 0;
  }
  &Fifth {
    opacity: 0;
  }
}
.smallFire {
  height: 22px;
  width: 22px;
}
.fireIsOn {
  color: $colorLight;
}

@keyframes fireAnimationFirst {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
    z-index: 20;
  }
  100% {
    transform: rotate($animationRotateFirst) scale(2);
    opacity: 0;
    z-index: 1;
  }
}
@keyframes fireAnimationSecond {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
    z-index: 20;
  }
  100% {
    transform: rotate($animationRotateSecond) scale(2);
    opacity: 0;
    z-index: 1;
  }
}
@keyframes fireAnimationThird {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
    z-index: 20;
  }
  100% {
    transform: rotate($animationRotateThird) scale(2);
    opacity: 0;
    z-index: 1;
  }
}
@keyframes fireAnimationFourth {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
    z-index: 20;
  }
  100% {
    transform: rotate($animationRotateFourth) scale(2);
    opacity: 0;
    z-index: 1;
  }
}
@keyframes fireAnimationFifth {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
    z-index: 20;
  }
  100% {
    transform: rotate($animationRotateFifth) scale(2);
    opacity: 0;
    z-index: 1;
  }
}
</style>
