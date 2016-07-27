# watcher-lessc
===

Watch `.less file` & `directory`  to compile to .css whenever file is saved.

Now ,You can :

1. Specify search paths for @import directives.
2. Minify CSS output.
3. Specify a filename, for better error messages.
4. Specify input directory to watch.

But , You must specify `input` & `output` !

## Usage
---

1. Help documents

		watcher-lessc

	Usage: {OPTIONS}

	Options:
	  --input, -i      Specify input file to watch/compile.               [required]
	  --paths, -p      Specify search paths for @import directives.    [default: []]
	  --compress, -c   Minify CSS output.                                           
	  --filename, -f   Specify a filename, for better error messages. [default: "style.less"]
	  --directory, -d  Specify input directory to watch.                            
	  --output, -o     Specify output file path.                          [required]
	  --help, -h       Show this message                                            

2. Specify input `.less` file & output `.css` file

		watcher-lessc -i less/index.less -o css/inde.css
		
3. Specify input directory to watch.

		watcher-lessc -i less/index.less -o css/inde.css -d ./less
		
4. Specify less render options

		watcher-lessc -i less/index.less -o css/inde.css -d ./less -p ./less -f style.less -c
		
## Contact

	If you have some questions, please email: [liuhong1.happy@163.com](liuhong1.happy@163.com) .