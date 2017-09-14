<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xi="http://www.w3.org/2001/XInclude" xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:fn="http://www.w3.org/2005/xpath-functions" version="1.0" exclude-result-prefixes="tei xi fn">
  <xsl:output method="html" indent="no" encoding="UTF-8" version="4.0"/>

  <xsl:template match="tei:app">
    <xsl:element name="li">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:foreign">
    <xsl:element name="em">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:lem">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>lem</xsl:text>
      </xsl:attribute>
      <xsl:element name="span">
	<xsl:attribute name="class">
	  <xsl:text>lem-text</xsl:text>
	</xsl:attribute>
	<xsl:apply-templates/>
      </xsl:element>
      <xsl:if test="@wit">
	<xsl:text> </xsl:text>
	<xsl:element name="span">
	  <xsl:attribute name="class">
	    <xsl:text>siglum</xsl:text>
	  </xsl:attribute>
	  <xsl:value-of select="translate(translate(translate(@wit,'abc','ABC'),'#',''),' ','')"/>
	</xsl:element>
      </xsl:if>
      <xsl:if test="@type='conj'">
	<xsl:text> </xsl:text>
	<xsl:element name="span">
	  <xsl:attribute name="class">
	    <xsl:text>rdg-comment</xsl:text>
	  </xsl:attribute>
	  <xsl:text>conj.</xsl:text>
	  <xsl:if test="@resp">
	    <xsl:text> </xsl:text>
	    <xsl:value-of select="@resp"/>
	  </xsl:if>
	</xsl:element>
      </xsl:if>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:listApp">
    <xsl:element name="h4">
      <xsl:text>Apparatus</xsl:text>
    </xsl:element>
    <xsl:element name="ul">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:note[@type='apparatus']">
    <xsl:element name="div">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:note[not(@type='apparatus')]">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>app-note</xsl:text>
      </xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:rdg">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>rdg</xsl:text>
      </xsl:attribute>
      <xsl:element name="span">
	<xsl:attribute name="class">
	  <xsl:text>rdg-text</xsl:text>
	</xsl:attribute>
	<xsl:apply-templates/>
      </xsl:element>
      <xsl:if test="@type='conj'">
	<xsl:text> </xsl:text>
	<xsl:element name="span">
	  <xsl:attribute name="class">
	    <xsl:text>rdg-comment</xsl:text>
	  </xsl:attribute>
	  <xsl:text>conj.</xsl:text>
	  <xsl:if test="@resp">
	    <xsl:text> </xsl:text>
	    <xsl:value-of select="@resp"/>
	  </xsl:if>
	</xsl:element>
      </xsl:if>
      <xsl:if test="@wit">
	<xsl:text> </xsl:text>
	<xsl:element name="span">
	  <xsl:attribute name="class">
	    <xsl:text>siglum-ms</xsl:text>
	  </xsl:attribute>
	  <xsl:value-of select="translate(translate(translate(@wit,'abc','ABC'),'#',''),' ','')"/>
	</xsl:element>
      </xsl:if>
      <xsl:if test="@src">
	<xsl:text> </xsl:text>
	<xsl:element name="span">
	  <xsl:attribute name="class">
	    <xsl:text>siglum-print</xsl:text>
	  </xsl:attribute>
	  <xsl:value-of select="translate(translate(@src,'#',''),' ','')"/>
	</xsl:element>
      </xsl:if>
      <xsl:choose>
	<xsl:when test="./following-sibling::tei:rdg">
	  <xsl:text>; </xsl:text>
	</xsl:when>
	<xsl:when test="not(following-sibling::tei:rdg)">
	  <xsl:text>. </xsl:text>
	</xsl:when>
	<xsl:otherwise/>
      </xsl:choose>
    </xsl:element>
  </xsl:template>
 

</xsl:stylesheet>
