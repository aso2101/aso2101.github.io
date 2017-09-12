<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xi="http://www.w3.org/2001/XInclude" xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:fn="http://www.w3.org/2005/xpath-functions" version="1.0" exclude-result-prefixes="tei xi fn">
  <xsl:output method="html" indent="no" encoding="UTF-8" version="4.0"/>

  <xsl:template match="tei:caesura">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>caesura</xsl:text>
      </xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:hi">
    <xsl:element name="em">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:l">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>l</xsl:text>
	<xsl:if test="./ancestor-or-self::*[@xml:id='kan-Kann']">
	  <xsl:text> kan-Kann</xsl:text>
	</xsl:if>
	<xsl:if test="./ancestor-or-self::*[@xml:id='kan-Latn']">
	  <xsl:text> kan-Latn</xsl:text>
	</xsl:if>
      </xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:lg">
    <xsl:element name="div">
      <xsl:attribute name="class">
        <xsl:text>lg</xsl:text>
      </xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

</xsl:stylesheet>
