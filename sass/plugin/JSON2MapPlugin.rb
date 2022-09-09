#encoding: utf-8

require "sass"
require "json"


module JSON2MapPlugin

  # @param path [Sass::Script::String] 
  def json2Map(path)
  
    map = {}
    
    # ログ出力用
    logger = Sass::Logger::Base.new()

    # imagesまでの絶対パスを取得
    imgDirPath = $projectFileDir + "/sp_img/"

    jsonPath = imgDirPath + path.value

    # 指定されたファイルが存在しなければ空のmapを返す
    if !File.exist?(jsonPath)
      logger.log(:debug, "指定されたファイルが見つかりませんでした。(" + jsonPath + ")")
      return Sass::Script::Value::Map.new(map)
    end

    # JSON文字列を取得して、Rubyオブジェクトに変換
    fp = open(jsonPath)
    str = fp.read
    fp.close
    json = JSON.parse(str)

    # SassのMapデータに変換する
    json.each {|key, value|
      sassKeyName = Sass::Script::Value::String.new(key)
      map[sassKeyName] = self._nest(value)
    }
    map = Sass::Script::Value::Map.new(map)
    return map
  end
  
  # 型に応じたSassオブジェクトに変換していく
  def _nest(val)
  
    # 配列
    if val.is_a?(Array)
      return Sass::Script::Value::List.new(val.map {|i| self._nest(i)}, :comma)
    
    # 連想配列
    elsif val.is_a?(Hash)
      map = {}
      val.each{ |key, value|
        map[Sass::Script::Value::String.new(key)] = self._nest(value)
      }
      return Sass::Script::Value::Map.new(map)
    
    # 数値型
    elsif val.is_a?(Numeric)
      return Sass::Script::Value::Number.new(val)
    
    # 真偽値
    elsif val.eql?(true) || val.eql?(false)
      return Sass::Script::Value::Bool.new(val)
    
    # それ以外
    else
      return Sass::Script::Value::String.new(val.to_s)
    end
  end
  
end

module Sass::Script::Functions
  include JSON2MapPlugin
end