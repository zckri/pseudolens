var App = {
	useComposer: false,
	collidable: null,
	updateFcts: [],
	onAnimate: function() {

	},

	init: function() {

		this.renderer = new THREE.WebGLRenderer({ antialias: true }),

		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
        this.renderer.setClearColor( 0, 1 );

        this.initCamera();
        this.initScene();
	},

	initCamera: function() {
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 27000 );
		this.camera.position = new THREE.Vector3(0,0,0);
		

		this.controls = new THREE.FirstPersonControls( this.camera );
		this.controls.movementSpeed = 12;

	},

	initScene: function() {
		this.scene = new THREE.Scene();
	},

	initComposer: function(options) {


		
		// LENS SHADER -----------------------------------------------
		// LENS SHADER -----------------------------------------------
		// LENS SHADER -----------------------------------------------
		this.colorRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
		    minFilter : THREE.LinearFilter,
		    magFilter : THREE.LinearFilter,
		    format    : THREE.RGBFormat,
		});
		
		this.ssLensFlare = new THREEx.SsLensFlare(this.renderer, this.colorRenderTarget);
		this.composer = new THREE.EffectComposer( this.renderer );
		this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );
				
		// add Render Pass
		var effect  = new THREE.TexturePass(this.colorRenderTarget);
		this.composer.addPass( effect );

		// add blend with lensflare
		var effect  = new THREE.ShaderPass(THREEx.SsLensFlare.BlendShader);
		effect.uniforms['tLensDirt' ].value = THREE.ImageUtils.loadTexture( "images/lensdirt.png" );
		effect.uniforms['tLensStar' ].value = THREE.ImageUtils.loadTexture( "images/lensstar.png" );
		effect.uniforms['tLensColor' ].value    = this.ssLensFlare.lensRenderTarget;
		this.composer.addPass( effect ); 
		// LENS SHADER -----------------------------------------------
		// LENS SHADER -----------------------------------------------
		// LENS SHADER -----------------------------------------------

		var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
        effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth,  1 / window.innerHeight );
        effectFXAA.renderToScreen = false;


        if(options.rgbPass !== false){
        	var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
				effect.uniforms[ 'amount' ].value = 0.0030;
				effect.renderToScreen = false;
				this.composer.addPass(effect);
				this.rgbShift = effect;
        }

		if(options.filmPass !== false){
				var effectFilm = new THREE.FilmPass( 0.25, 1, 1048, false );
				effectFilm.renderToScreen = false;
				this.composer.addPass( effectFilm );
		}

        this.composer.addPass( effectFXAA );

        this.composer.passes[this.composer.passes.length-1].renderToScreen    = true;
	},

	start: function(options) {
		if(this.renderer === undefined)
			this.init();

		if(options!==undefined){
			if(options.useComposer) {
				this.useComposer = true;
				this.initComposer(options);
			}
		}

		var that = this;
		requestAnimationFrame( function() { that.start(); } )
		this.render();		
		this.onAnimate();
		
	},

	add: function(arg) {
		this.scene.add(arg);
	},

	addMany: function(arg) {
		for(var i=0; i<arg.length; i++)
			this.scene.add(arg[i]);
	},
	// REMOVE THIS
	loadEnvironment: function() {
		var imagePrefix = "images/skybox/dd_";
		var directions  = ["right1", "left2", "top3", "bottom4", "front5", "back6"];
		var imageSuffix = ".png";
		
		skyMaterial = new THREE.MeshBasicMaterial({ 
			map: THREE.ImageUtils.loadTexture( 'images/skybox/back.jpg' ),
			side: THREE.BackSide, 
			depthWrite: false
		});
		skyM2 = new THREE.MeshBasicMaterial({ 
			map: THREE.ImageUtils.loadTexture( 'images/skybox/back2.jpg' ),
			side: THREE.BackSide, 
			depthWrite: false,
			transparent: true,
			opacity: 0.5
		});
		var skyGeometry = new THREE.SphereGeometry( 16000, 64, 64 );
		
		var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);

		skyBox.position = new THREE.Vector3(0,0,0);
		
		this.scene.add( skyBox );

		this.skyBox = skyBox;


		//this.scene.fog = new THREE.FogExp2( 0x333333, 0.00003 );

		this.initSun();
	},

	initSun: function()
	{
	        var particles = new THREE.Geometry();
	        var pMaterial =
	          new THREE.ParticleBasicMaterial({
	            color: 0xFFFFFF,
	            size:9000,
	            depthWrite: false,
	            sortParticles: false,
	            map: THREE.ImageUtils.loadTexture(
	              "images/particle.png"
	            ),
	            blending: THREE.AdditiveBlending,
	            transparent: true,
	            opacity:1

	          });
			

				var particle = new THREE.Vertex(new THREE.Vector3(350, 100, -400));
            	particles.vertices.push(particle);
    
            particleSystem = new THREE.ParticleSystem( particles, pMaterial);
            this.sun = particleSystem;
            this.scene.add(particleSystem);

			 var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
			 //directionalLight.position.set( -350, 100, -200 );
			 //directionalLight.target.position = this.camera.position.clone();
			 this.dirlight = directionalLight;
			 this.dirlight.position = this.sun.position;
			 this.scene.add( directionalLight );

	},

	render: function() {

		
		this.controls.update(1);
		
		this.renderer.render(this.scene, this.camera,this.colorRenderTarget);
		
		if(this.useComposer){
			this.ssLensFlare.render(0.15);
			this.composer.render(0.15);
		}else
			this.renderer.render(this.scene, this.camera);

	}

}