<template>
    <div
      class="el-switch"
      :class="{ 'is-disabled': switchDisabled, 'is-checked': checked }"
      role="switch"
      :aria-checked="checked"
      :aria-disabled="switchDisabled"
      @click.prevent="switchValue"
    >
      <input
        class="switch_input"
        type="checkbox"
        @change="handleChange"
        ref="input"
        :id="id"
        :name="name"
        :true-value="activeValue"
        :false-value="inactiveValue"
        :disabled="switchDisabled"
        @keydown.enter="switchValue"
      >
      <span
        :class="['el-switch__label', 'el-switch__labonly--left', !checked ? 'is-active' : '']"
        v-if="inactiveIconClass || inactiveText">
        <i :class="[inactiveIconClass]" v-if="inactiveIconClass"></i>
        <span v-if="!inactiveIconClass && inactiveText" :aria-hidden="checked">{{ inactiveText }}</span>
      </span>
      <span class="el-switch__core" ref="core" :style="{ 'width': coreWidth + 'px' }">
      </span>
      <span
        :class="['el-switch__label', 'el-switch__labonly--right', checked ? 'is-active' : '']"
        v-if="activeIconClass || activeText">
        <i :class="[activeIconClass]" v-if="activeIconClass"></i>
        <span v-if="!activeIconClass && activeText" :aria-hidden="!checked">{{ activeText }}</span>
      </span>
    </div>
  </template>
  <script>
    import emitter from '../mixins/emitter';
    import Focus from '../mixins/focus';
    import Migrating from '../mixins/migrating';
  
    export default {
      name: 'OnlySwitch',
      mixins: [Focus('input'), Migrating, emitter],
      inject: {
        elForm: {
          default: ''
        }
      },
      props: {
        value: {
          type: [Boolean, String, Number],
          default: false
        },
        disabled: {
          type: Boolean,
          default: false
        },
        width: {
          type: Number,
          default: 40
        },
        activeIconClass: {
          type: String,
          default: ''
        },
        inactiveIconClass: {
          type: String,
          default: ''
        },
        activeText: String,
        inactiveText: String,
        activeColor: {
          type: String,
          default: ''
        },
        inactiveColor: {
          type: String,
          default: ''
        },
        activeValue: {
          type: [Boolean, String, Number],
          default: true
        },
        inactiveValue: {
          type: [Boolean, String, Number],
          default: false
        },
        name: {
          type: String,
          default: ''
        },
        validateEvent: {
          type: Boolean,
          default: true
        },
        id: String
      },
      data() {
        return {
          coreWidth: this.width
        };
      },
      created() {
        if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
          this.$emit('input', this.inactiveValue);
        }
      },
      computed: {
        checked() {
          return this.value === this.activeValue;
        },
        switchDisabled() {
          return this.disabled || (this.elForm || {}).disabled;
        }
      },
      watch: {
        checked() {
          this.$refs.input.checked = this.checked;
          if (this.activeColor || this.inactiveColor) {
            this.setBackgroundColor();
          }
          if (this.validateEvent) {
            this.dispatch('ElFormItem', 'el.form.change', [this.value]);
          }
        }
      },
      methods: {
        handleChange(event) {
          const val = this.checked ? this.inactiveValue : this.activeValue;
          this.$emit('input', val);
          this.$emit('change', val);
          this.$nextTick(() => {
            // set input's checked property
            // in case parent refuses to change component's value
            if (this.$refs.input) {
              this.$refs.input.checked = this.checked;
            }
          });
        },
        setBackgroundColor() {
          let newColor = this.checked ? this.activeColor : this.inactiveColor;
          this.$refs.core.style.borderColor = newColor;
          this.$refs.core.style.backgroundColor = newColor;
        },
        switchValue() {
          !this.switchDisabled && this.handleChange();
        },
        getMigratingConfig() {
          return {
            props: {
              'on-color': 'on-color is renamed to active-color.',
              'off-color': 'off-color is renamed to inactive-color.',
              'on-text': 'on-text is renamed to active-text.',
              'off-text': 'off-text is renamed to inactive-text.',
              'on-value': 'on-value is renamed to active-value.',
              'off-value': 'off-value is renamed to inactive-value.',
              'on-icon-class': 'on-icon-class is renamed to active-icon-class.',
              'off-icon-class': 'off-icon-class is renamed to inactive-icon-class.'
            }
          };
        }
      },
      mounted() {
        /* istanbul ignore if */
        this.coreWidth = this.width || 40;
        if (this.activeColor || this.inactiveColor) {
          this.setBackgroundColor();
        }
        this.$refs.input.checked = this.checked;
      }
    };
  </script>
<style scoped lang="scss">
.switch_input {
  display: block;
  margin-bottom: 1.5em;
  font-size: 1em;
  position: absolute;
  right: 18px;
}

.switch_input {
  background-color: rgba(0,0,0,0.7);
  border-radius: 0.75em;
  box-shadow: 0.125em 0.125em 0 0.125em rgba(0,0,0,0.3) inset;
  color: #fdea7b;
  display: inline-flex;
  align-items: center;
  margin: auto;
  padding: 0.15em;
  width: 3em;
  height: 1.5em;
  transition: background-color 0.1s 0.3s ease-out, box-shadow 0.1s 0.3s ease-out;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.switch_input:before, .switch_input:after {
  content: "";
  display: block;
}

.switch_input:before {
  background-color: #fff;
  border-radius: 50%;
  width: 1.2em;
  height: 1.2em;
  transition: background-color 0.1s 0.3s ease-out, transform 0.3s ease-out;
  z-index: 1;
}

.switch_input:after {
  background: linear-gradient(transparent 50%, rgba(0,0,0,0.15) 0) 0 50% / 50% 100%,
		repeating-linear-gradient(90deg,#bbb 0,#bbb,#bbb 20%,#999 20%,#999 40%) 0 50% / 50% 100%,
		radial-gradient(circle at 50% 50%,#888 25%, transparent 26%);
  background-repeat: no-repeat;
  border: 0.25em solid transparent;
  border-left: 0.4em solid #d8d8d8;
  border-right: 0 solid transparent;
  transition: border-left-color 0.1s 0.3s ease-out, transform 0.3s ease-out;
  transform: translateX(-22.5%);
  transform-origin: 25% 50%;
  width: 1.2em;
  height: 1em;
  box-sizing: border-box;
}
/* Checked */
.switch_input:checked {
  background-color: rgba(0,0,0,0.45);
  box-shadow: 0.125em 0.125em 0 0.125em rgba(0,0,0,0.1) inset;
}

.switch_input:checked:before {
  background-color: currentColor;
  transform: translateX(125%)
}

.switch_input:checked:after {
  border-left-color: currentColor;
  transform: translateX(-2.5%) rotateY(180deg);
}
/* Other States */
.switch_input:focus {
	/* Usually an anti-A11Y practice but set to remove an annoyance just for this demo */
  outline: 0;
}
.el-switch__core{
    opacity: 0;
    z-index: 999;
}
</style>
