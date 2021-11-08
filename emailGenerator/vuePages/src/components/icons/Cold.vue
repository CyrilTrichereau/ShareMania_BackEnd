<template>
  <button
    :class="{
      coldIconIsOn: isActive && !infinite,
      coldIconIsOnInfinite: isActive && infinite,
      smallColdIcon: small,
    }"
    class="coldIcon"
  >
    <!-- Snow flakes fallings -->
    <i
      class="fas fa-snowflake snowFlakeFallingIcon snowFlakeFallingIconFirst"
      :class="{ coldIsOn: isActive, smallColdFallingIcon: small }"
    ></i>
    <i
      class="fas fa-snowflake snowFlakeFallingIcon snowFlakeFallingIconFirst"
      :class="{ coldIsOn: isActive, smallColdFallingIcon: small }"
    ></i>
    <i
      class="fas fa-snowflake snowFlakeFallingIcon snowFlakeFallingIconSecond"
      :class="{ coldIsOn: isActive, smallColdFallingIcon: small }"
    ></i>
    <i
      class="fas fa-snowflake snowFlakeFallingIcon snowFlakeFallingIconThird"
      :class="{ coldIsOn: isActive, smallColdFallingIcon: small }"
    ></i>
    <i
      class="fas fa-snowflake snowFlakeFallingIcon snowFlakeFallingIconFourth"
      :class="{ coldIsOn: isActive, smallColdFallingIcon: small }"
    ></i>
    <i
      class="fas fa-snowflake snowFlakeFallingIcon snowFlakeFallingIconFifth"
      :class="{ coldIsOn: isActive, smallColdFallingIcon: small }"
    ></i>
    <i
      class="fas fa-snowflake snowFlakeFallingIcon snowFlakeFallingIconSixth"
      :class="{ coldIsOn: isActive, smallColdFallingIcon: small }"
    ></i>
    <i
      class="fas fa-snowflake snowFlakeFallingIcon snowFlakeFallingIconSeventh"
      :class="{ coldIsOn: isActive, smallColdFallingIcon: small }"
    ></i>
    <i
      class="fas fa-snowflake snowFlakeFallingIcon snowFlakeFallingIconEighth"
      :class="{ coldIsOn: isActive, smallColdFallingIcon: small }"
    ></i>
    <i
      class="fas fa-snowflake snowFlakeFallingIcon snowFlakeFallingIconNinth"
      :class="{ coldIsOn: isActive, smallColdFallingIcon: small }"
    ></i>
    <i
      class="fas fa-snowflake snowFlakeFallingIcon snowFlakeFallingIconTenth"
      :class="{ coldIsOn: isActive, smallColdFallingIcon: small }"
    ></i>

    <!-- Snow flake shaking -->
    <i
      class="fas fa-snowflake snowFlake"
      :class="{ coldIsOn: isActive, smallColdShakingIcon: small }"
    ></i>
  </button>
</template>

<script>
export default {
  name: "Cold",
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

$animationTimeShaking: 1200ms;
$animationTimeFalling: 3000ms;
$animationShakingIterate: 5;
$animationFallingIterate: 4;
// Delay
$animationDelay: 300ms;
$animationDelayThird: 1000ms;
$animationDelayFourth: 1700ms;
$animationDelayFifth: 2400ms;
$animationDelaySixth: 3100ms;
$animationDelaySeventh: 3800ms;
$animationDelayEighth: 4500ms;
$animationDelayNinth: 5200ms;
$animationDelayTenth: 5900ms;
$animationDelayEleventh: 6600ms;
// COLORS
$primary: #4d7c8a;
$secondary: #938f60;
$danger: #c02200;
$warning: rgb(107, 159, 255);
$light: #fdfeff;

.coldIcon {
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
  overflow: hidden;
  &:hover {
    & > .snowFlake {
      animation: flakeShaking $animationTimeShaking ease-in-out infinite;
    }
    & > .snowFlakeFallingIcon {
      &First {
        left: 50%;
        animation: flakeFalling $animationTimeFalling ease-in-out infinite;
      }
      &Second {
        left: 10%;
        animation: flakeFalling $animationTimeFalling $animationDelay
          ease-in-out infinite;
      }
      &Third {
        right: 10%;
        animation: flakeFalling $animationTimeFalling $animationDelayThird
          ease-in-out infinite;
      }
      &Fourth {
        left: 40%;
        animation: flakeFalling $animationTimeFalling $animationDelayFourth
          ease-in-out infinite;
      }
      &Fifth {
        right: 20%;
        animation: flakeFalling $animationTimeFalling $animationDelayFifth
          ease-in-out infinite;
      }
      &Sixth {
        left: 20%;
        animation: flakeFalling $animationTimeFalling $animationDelaySixth
          ease-in-out infinite;
      }
      &Seventh {
        right: 40%;
        animation: flakeFalling $animationTimeFalling $animationDelaySeventh
          ease-in-out infinite;
      }
      &Eighth {
        left: 0%;
        animation: flakeFalling $animationTimeFalling $animationDelayEighth
          ease-in-out infinite;
      }
      &Ninth {
        right: 0%;
        animation: flakeFalling $animationTimeFalling $animationDelayNinth
          ease-in-out infinite;
      }
      &Tenth {
        left: 30%;
        animation: flakeFalling $animationTimeFalling $animationDelayTenth
          ease-in-out infinite;
      }
      &Eleventh {
        right: 30%;
        animation: flakeFalling $animationTimeFalling $animationDelayEleventh
          ease-in-out infinite;
      }
    }
  }
}

.coldIconIsOn {
  background: $warning;
  & > .snowFlake {
    animation: flakeShaking $animationTimeShaking ease-in-out
      $animationShakingIterate;
  }
  & > .snowFlakeFallingIcon {
    &First {
      left: 50%;
      animation: flakeFalling $animationTimeFalling ease-in-out
        $animationFallingIterate;
    }
    &Second {
      left: 10%;
      animation: flakeFalling $animationTimeFalling $animationDelay ease-in-out
        $animationFallingIterate;
    }
    &Third {
      right: 10%;
      animation: flakeFalling $animationTimeFalling $animationDelayThird
        ease-in-out $animationFallingIterate;
    }
    &Fourth {
      left: 40%;
      animation: flakeFalling $animationTimeFalling $animationDelayFourth
        ease-in-out $animationFallingIterate;
    }
    &Fifth {
      right: 20%;
      animation: flakeFalling $animationTimeFalling $animationDelayFifth
        ease-in-out $animationFallingIterate;
    }
    &Sixth {
      left: 20%;
      animation: flakeFalling $animationTimeFalling $animationDelaySixth
        ease-in-out $animationFallingIterate;
    }
    &Seventh {
      right: 40%;
      animation: flakeFalling $animationTimeFalling $animationDelaySeventh
        ease-in-out $animationFallingIterate;
    }
    &Eighth {
      left: 0%;
      animation: flakeFalling $animationTimeFalling $animationDelayEighth
        ease-in-out $animationFallingIterate;
    }
    &Ninth {
      right: 0%;
      animation: flakeFalling $animationTimeFalling $animationDelayNinth
        ease-in-out $animationFallingIterate;
    }
    &Tenth {
      left: 30%;
      animation: flakeFalling $animationTimeFalling $animationDelayTenth
        ease-in-out $animationFallingIterate;
    }
    &Eleventh {
      right: 30%;
      animation: flakeFalling $animationTimeFalling $animationDelayEleventh
        ease-in-out $animationFallingIterate;
    }
  }
}

.coldIconIsOnInfinite {
  background: $warning;
  & > .snowFlake {
    animation: flakeShaking $animationTimeShaking ease-in-out infinite;
  }
  & > .snowFlakeFallingIcon {
    &First {
      left: 50%;
      animation: flakeFalling $animationTimeFalling ease-in-out infinite;
    }
    &Second {
      left: 10%;
      animation: flakeFalling $animationTimeFalling $animationDelay ease-in-out
        infinite;
    }
    &Third {
      right: 10%;
      animation: flakeFalling $animationTimeFalling $animationDelayThird
        ease-in-out infinite;
    }
    &Fourth {
      left: 40%;
      animation: flakeFalling $animationTimeFalling $animationDelayFourth
        ease-in-out infinite;
    }
    &Fifth {
      right: 20%;
      animation: flakeFalling $animationTimeFalling $animationDelayFifth
        ease-in-out infinite;
    }
    &Sixth {
      left: 20%;
      animation: flakeFalling $animationTimeFalling $animationDelaySixth
        ease-in-out infinite;
    }
    &Seventh {
      right: 40%;
      animation: flakeFalling $animationTimeFalling $animationDelaySeventh
        ease-in-out infinite;
    }
    &Eighth {
      left: 0%;
      animation: flakeFalling $animationTimeFalling $animationDelayEighth
        ease-in-out infinite;
    }
    &Ninth {
      right: 0%;
      animation: flakeFalling $animationTimeFalling $animationDelayNinth
        ease-in-out infinite;
    }
    &Tenth {
      left: 30%;
      animation: flakeFalling $animationTimeFalling $animationDelayTenth
        ease-in-out infinite;
    }
    &Eleventh {
      right: 30%;
      animation: flakeFalling $animationTimeFalling $animationDelayEleventh
        ease-in-out infinite;
    }
  }
}

.snowFlake {
  position: absolute;
  color: $warning;
  font-size: 2rem;
  bottom: 10%;

  &FallingIcon {
    position: absolute;
    opacity: 0;
    color: $warning;
    font-size: 0.7rem;
  }
}

// Small styles for component of cold icon container
.smallColdIcon {
  height: 48px;
  width: 48px;
  padding: 10px;
}

// Small styles for snow flake shaking icon
.smallColdShakingIcon {
  height: 22px;
  width: 22px;
}

.coldIsOn {
  color: $light;
}

.smallColdFallingIcon {
  height: 8px;
  width: 8px;
}

// Animations
@keyframes flakeFalling {
  0% {
    transform: translateY(-180%) translateX(50%);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-85%) translateX(-50%);
  }
  60% {
    transform: translateY(10%) translateX(50%);
  }
  90% {
    transform: translateY(105%) translateX(-50%);
  }
  100% {
    transform: translateY(170%) translateX(50%);
    opacity: 0.2;
  }
}
@keyframes flakeShaking {
  0% {
    transform: translateX(15%) scale(1);
  }
  4% {
    transform: translateX(-15%) scale(1);
  }
  8% {
    transform: translateX(15%) scale(1);
  }
  12% {
    transform: translateX(-15%) scale(1);
  }
  16% {
    transform: translateX(15%) scale(1);
  }
  20% {
    transform: translateX(-15%) scale(1);
  }
  24% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(0%);
  }
}
</style>
