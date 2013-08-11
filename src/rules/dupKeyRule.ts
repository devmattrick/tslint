/*
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/// <reference path='rule.ts'/>
/// <reference path='abstractRule.ts'/>

module Lint.Rules {
    export class DupKeyRule extends AbstractRule {
        public static FAILURE_STRING = "duplicate key '";

        public isEnabled() : boolean {
            return this.getValue() === true;
        }

        public apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[] {
            return this.applyWithWalker(new DupKeyWalker(syntaxTree));
        }
    }

    class DupKeyWalker extends Lint.RuleWalker {
        private objectKeys;

        public visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): void {
            this.objectKeys = {};
            super.visitObjectLiteralExpression(node);
        }

        public visitSimplePropertyAssignment(node: TypeScript.SimplePropertyAssignmentSyntax): void {
            var keyToken = node.propertyName;
            var key = keyToken.text();
            if (this.objectKeys[key]) {
                var position = this.position() + node.leadingTriviaWidth();
                var failureString = DupKeyRule.FAILURE_STRING + key + "'";
                this.addFailure(this.createFailure(position, keyToken.width(), failureString));
            } else {
                this.objectKeys[key] = true;
            }

            super.visitSimplePropertyAssignment(node);
        }
    }
}
