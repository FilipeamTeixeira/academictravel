<script>
    export let segment;
    import logoUgent from '/static/pictures/logo_ugent.png'

  </script>
  
  <style>
    footer {
      @apply absolute;
      @apply antialiased;
      @apply flex;
      @apply bottom-0;
     /* @apply h-auto; */
     height:20px;
      @apply w-full;
    }
    
    .resume-copyright {
      @apply inline-block;
      @apply mx-auto;
      @apply text-gray-500;
      @apply w-full;
    }
    .logo {
      height: 100px;
      width: 100px;
    }
   

  </style>
  
  <footer id="footer">
      <div class="h-full w-full bg-transparent py-3">
        <div class="flex flex-col-reverse lg:flex-row mx-auto text-center">
          <div class="resume-copyright">
            <p class="text-base">Handcrafted by me © ayobuenavista</p>
          </div>
          <div>
            <img class ="logo" src={logoUgent} href="" >
          </div>
        </div>
      </div>
  </footer>