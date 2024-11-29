
// Function to load the ad code
function loadAdCode() {
      var adScript = document.createElement('script');
      adScript.src = 'https://groleegni.net/401/8576603';
      adScript.async = true;
    
      // Handle script load errors
      adScript.onerror = function() {
        console.error('Failed to load the ad script');
      };
    
      // Append the script to the body
      try {
        (document.body || document.documentElement).appendChild(adScript);
      } catch (e) {
        console.error('Error appending the script:', e);
      }
    }
    
    // Set a timeout to load the ad code after 5 seconds
    setTimeout(loadAdCode, 5000); // 5000 milliseconds = 5 seconds
    

      // <script async="async" data-cfasync="false" src="//thubanoa.com/1?z=7996098"></script>
      