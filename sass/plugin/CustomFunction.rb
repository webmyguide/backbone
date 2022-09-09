#encoding: utf-8


require "sass"
require 'fastimage'


module CustomFunction
    # UnixTimestampを取得する関数
    def getUnixTimestamp()
      Sass::Script::Value::String.new(Time.now.to_i.to_s)
    end
    
	# 指定されたファイルパスから名前を取得
    def getFileName(path)
      Sass::Script::Value::String.new(File.basename(path.value, '.*'))
    end
    
	# 指定されたファイルパスから拡張子を取得
    def getExtension(path)
      Sass::Script::Value::String.new(File.extname(path.value))
    end
    
	# 文字列置換
    def strReplace(target, pattern, replace)
      str = target.value
      Sass::Script::Value::String.new(str.gsub(pattern.value, replace.value))
    end
	
	# 指定桁数によるゼロ埋め
	def zeroPadding(num, digit)
	  Sass::Script::Value::String.new(sprintf('%0' + digit.value.to_s + 'd', num.value))
	end

    # 画像の横幅取得
    def image_width(image_file)
       width = imageSize(image_file)
       Sass::Script::Value::Number.new(width.to_i, "px")
    end

    # 画像の縦幅取得
    def image_height(image_file)
       height = imageSize(image_file, 1)
       Sass::Script::Value::Number.new(height.to_i, "px")
    end

    # 画像サイズ取得
    def imageSize(path, div = 0)
        imagePath = path.value.gsub('"', '')
        imgDirPath = $projectFileDir + '/' + $imagesDir + '/' + imagePath
        if !(FileTest.exist?(imgDirPath)) then
            $logger.log(:debug, '指定した画像ありません(' + imgDirPath + ')')
            return
        else
            image = FastImage.size(imgDirPath, :raise_on_failure=>true, :timeout=>1.0)
        end
        size = image[div]
        return size
    end

    # 画像URL取得
    def image_url(path, only_path = false, cache_buster = true)
          path = path.value

          if (cache_buster == true) then
            timestamp = getUnixTimestamp()
          else
            timestamp = ''
          end

          if only_path then
            image = $httpPath + $imagesDir + '/' + path + timestamp
          else
            image = "url(\"#{$httpPath}#{$imagesDir}/#{path}?#{timestamp}\")"
          end

        Sass::Script::Value::String.new(image)
    end


end

module Sass::Script::Functions
    include CustomFunction
end