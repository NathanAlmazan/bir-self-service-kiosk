import type { FormNode } from ".";
import ConditionNode from "./condition-node";
import RequirementNode from "./requirement-node";

export default function TreeNode({
  data,
  selected,
  handleSelect,
}: {
  data: FormNode;
  selected: string;
  handleSelect: (node: FormNode) => void;
}) {
  if (data.type === "condition") {
    return (
      <ConditionNode
        data={data}
        selected={selected}
        handleSelect={handleSelect}
      />
    );
  } else if (data.type === "requirement") {
    return (
      <RequirementNode
        data={data}
        selected={selected}
        handleSelect={handleSelect}
      />
    );
  }
}
