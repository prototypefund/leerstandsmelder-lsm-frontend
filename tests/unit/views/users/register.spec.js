import Vuex from "vuex";
import { i18n } from "@/i18n";
import { expect } from "chai";
import { config, shallowMount, createLocalVue } from "@vue/test-utils";
config.logModifiedComponents = false;
config.mocks.$t = (key) => key;
import Register from "@/views/Users/Register.vue";
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.config.productionTip = false;
localVue.config.devtools = false;

describe("Register.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "users.register";
    const wrapper = shallowMount(Register, {
      i18n,
      localVue,
      propsData: { msg },
    });
    expect(wrapper.text()).to.include(msg);
  });
});
