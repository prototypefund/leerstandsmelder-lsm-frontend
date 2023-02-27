import { expect } from "chai";
import { config, shallowMount, createLocalVue } from "@vue/test-utils";
config.logModifiedComponents = false;
config.mocks.$t = (key) => key;
import HelloWorld from "@/components/HelloWorld.vue";
//import HelloI18n from '@/components/HelloI18n.vue'
//const localVue = createLocalVue();

//localVue.config.productionTip = false

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "Welcome to Vuetify";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
    });
    expect(wrapper.text()).to.include(msg);
  });
});
