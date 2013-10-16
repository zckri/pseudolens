/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Luminosity
 * http://en.wikipedia.org/wiki/Luminosity
 */

THREE.DodgeShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",
			"vec4 uScale;",
   			"vec4 uBias;",
			"uScale = vec4(0.1,0.1,0.1,0.5);",
			"uBias = vec4(1.0,1.0,1.0,0.0);",
			"vec4 texel = texture2D( tDiffuse, vUv );",

			//" fResult = max(vec4(0.0), texture(uInputTex, vTexcoord) + uBias) * uScale;"

			"gl_FragColor = max(vec4(0.0,0.0,0.0,0.0),texel + uBias) * uScale;",

		"}"

	].join("\n")

};
