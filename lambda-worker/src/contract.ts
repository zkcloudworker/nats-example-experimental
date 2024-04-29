import { Field, ZkProgram } from "o1js";

export const ExampleZkApp = ZkProgram({
  name: "zk-app",

  methods: {
    check: {
      privateInputs: [Field],
      async method(value: Field) {
        value.assertLessThanOrEqual(Field(100));
      },
    },
  },
});
