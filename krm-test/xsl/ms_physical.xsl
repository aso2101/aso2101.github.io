<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xi="http://www.w3.org/2001/XInclude" 
    xmlns:tei="http://www.tei-c.org/ns/1.0" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions" version="1.0" 
    exclude-result-prefixes="tei xi fn">
  <xsl:output 
      method="html" 
      indent="no" 
      omit-xml-declaration="yes" 
      encoding="UTF-8" 
      version="4.0"/>
  <xsl:strip-space elements="tei:*"/>

  <xsl:template match="tei:add">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>add</xsl:text>
	<xsl:if test="@place">
	  <xsl:text> </xsl:text>
	  <xsl:value-of select="@place"/>
	</xsl:if>
      </xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:del">
    <xsl:element name="span">
      <xsl:attribute name="class">del</xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:lb[not(parent::tei:add)]">
    <xsl:element name="br"/>
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>lineation lineation-physical</xsl:text>
      </xsl:attribute>
      <xsl:value-of select="@n"/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:add/tei:lb">
    <xsl:element name="br"/>
  </xsl:template>
  <xsl:template match="tei:pb">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>foliation foliation-physical</xsl:text>
      </xsl:attribute>
      <xsl:value-of select="@n"/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:space">
    <xsl:element name="span">
      <xsl:attribute name="class">space</xsl:attribute>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:space[@type='binding-hole']">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>binding-hole</xsl:text>
      </xsl:attribute>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:unclear">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>uncertain</xsl:text>
      </xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="text()">
    <xsl:copy-of select="translate(.,' ','')"/>
  </xsl:template>

</xsl:stylesheet>
