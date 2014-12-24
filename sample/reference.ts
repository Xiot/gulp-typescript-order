module ts {
	
	export class Reference extends Test1 {

	}
}

angular.module('def')
	.controller('Reference', ts.Reference);