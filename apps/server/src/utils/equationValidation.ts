import { all, create, type EvalFunction, type MathNode } from "mathjs";

const MAX_EXPRESSION_LENGTH = 250;

const allowedFunctions = new Set([
  "sin",
  "cos",
  "tan",
  "sqrt",
  "ln",
  "log",
  "abs",
  "exp"
]);

const allowedConstants = new Set(["pi", "e"]);
const allowedOperators = new Set(["+", "-", "*", "/", "^"]);
const allowedNodeTypes = new Set([
  "OperatorNode",
  "ConstantNode",
  "SymbolNode",
  "ParenthesisNode",
  "FunctionNode"
]);

export class EquationValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export type ValidatedEquation = {
  expression: string;
  compiled: EvalFunction;
};

type InspectableMathNode = MathNode & {
  fn?: {
    name?: string;
  };
  name?: string;
  op?: string;
};

const math = create(all, {});

function getFunctionName(node: InspectableMathNode): string | undefined {
  return node.fn?.name ?? node.name;
}

function validateNode(node: MathNode): void {
  const inspectableNode = node as InspectableMathNode;

  if (!allowedNodeTypes.has(inspectableNode.type)) {
    throw new EquationValidationError(`Unsupported expression part: ${inspectableNode.type}.`);
  }

  if (inspectableNode.type === "SymbolNode") {
    const symbolName = inspectableNode.name;

    if (
      symbolName !== "x" &&
      !allowedConstants.has(symbolName ?? "") &&
      !allowedFunctions.has(symbolName ?? "")
    ) {
      throw new EquationValidationError(`Unsupported symbol "${symbolName}". Use x as the variable.`);
    }
  }

  if (inspectableNode.type === "OperatorNode" && !allowedOperators.has(inspectableNode.op ?? "")) {
    throw new EquationValidationError(`Unsupported operator "${inspectableNode.op}".`);
  }

  if (inspectableNode.type === "FunctionNode") {
    const functionName = getFunctionName(inspectableNode);

    if (!functionName || !allowedFunctions.has(functionName)) {
      throw new EquationValidationError(`Unsupported function "${functionName ?? "unknown"}".`);
    }
  }
}

export function validateEquationExpression(input: unknown): ValidatedEquation {
  if (typeof input !== "string") {
    throw new EquationValidationError("Expression is required.");
  }

  const expression = input.trim();

  if (!expression) {
    throw new EquationValidationError("Expression cannot be empty.");
  }

  if (expression.length > MAX_EXPRESSION_LENGTH) {
    throw new EquationValidationError(
      `Expression must be ${MAX_EXPRESSION_LENGTH} characters or fewer.`
    );
  }

  let node: MathNode;

  try {
    // math.js parses text into an expression tree, then compiles that tree.
    // This avoids JavaScript eval and lets us inspect the math before running it.
    node = math.parse(expression);
  } catch {
    throw new EquationValidationError("Expression could not be parsed.");
  }

  node.traverse((currentNode) => {
    validateNode(currentNode);
  });

  return {
    expression,
    compiled: node.compile()
  };
}
